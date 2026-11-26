#!/usr/bin/env python3
"""Tech Tree completion-claims service (task 32.5.10/7.5.10/6.5.9).

The smallest real server-side mechanism for the Kardashev 2.0 Tech Tree
at https://singularitywatch.org/tech-tree: visitors claim a step is
complete by submitting a claimant name/handle and an evidence URL (a
link to a verifiable result claiming completion of that step). No
evidence link, no claim — the URL is required and validated.

Claims are CLAIMS: they are stored and rendered back labeled as
community-submitted claims, not editorially verified fact. There are no
accounts, no voting, and no moderation queue.

Runs as a systemd user service (tech-tree-claims.service) on awsbox,
listening on 127.0.0.1:8919; nginx proxies /tech-tree/api/ to it.
Storage is a single JSON file outside the web checkout so deploys
(git fast-forwards) can never clobber it. Writes are serialized with a
lock and landed atomically (temp file + rename).

Endpoints (behind the /tech-tree/api/ proxy prefix):
  GET  /claims  -> {"claims": [{"node","claimant","evidence","ts"}, ...]}
  POST /claim   -> {"node","claimant","evidence"} ; 201 + the stored claim
                   400 with {"error": ...} on any validation failure.
"""

import argparse
import json
import re
import threading
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

LOCK = threading.Lock()
DATA_PATH = Path()
NODE_IDS = set()

MAX_BODY = 8192
CLAIMANT_RE = re.compile(r"^[^\x00-\x1f\x7f]{1,64}$")


def load_claims():
    if not DATA_PATH.exists():
        return []
    try:
        data = json.loads(DATA_PATH.read_text())
        if isinstance(data, dict) and isinstance(data.get("claims"), list):
            return data["claims"]
    except (json.JSONDecodeError, OSError):
        pass
    return []


def store_claims(claims):
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = DATA_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps({"claims": claims}, indent=1))
    tmp.replace(DATA_PATH)


def valid_evidence(url):
    if not isinstance(url, str) or not (8 <= len(url) <= 2048):
        return False
    if any(c in url for c in " \t\r\n\"'<>"):
        return False
    try:
        u = urlparse(url)
    except ValueError:
        return False
    return u.scheme in ("http", "https") and "." in (u.hostname or "")


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):  # keep the journal quiet
        pass

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.rstrip("/") in ("/claims", ""):
            with LOCK:
                claims = load_claims()
            self._json(200, {"claims": claims})
        else:
            self._json(404, {"error": "not found"})

    def do_POST(self):
        if self.path.rstrip("/") != "/claim":
            self._json(404, {"error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            self._json(400, {"error": "body must be JSON under 8 KB"})
            return
        try:
            payload = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, OSError):
            self._json(400, {"error": "body is not valid JSON"})
            return
        node = payload.get("node")
        claimant = payload.get("claimant")
        evidence = payload.get("evidence")
        if node not in NODE_IDS:
            self._json(400, {"error": "unknown tree step"})
            return
        if not isinstance(claimant, str) or not CLAIMANT_RE.match(claimant.strip()):
            self._json(400, {"error": "claimant name/handle required (1-64 characters)"})
            return
        if not valid_evidence(evidence):
            self._json(400, {"error": "an evidence link is required: a valid http(s) URL to a verifiable result"})
            return
        claim = {
            "node": node,
            "claimant": claimant.strip(),
            "evidence": evidence,
            "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        }
        with LOCK:
            claims = load_claims()
            claims.append(claim)
            store_claims(claims)
        self._json(201, claim)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8919)
    ap.add_argument("--data", required=True, help="claims JSON file (outside the web checkout)")
    ap.add_argument("--tree", required=True, help="tree.json, for the valid node id set")
    args = ap.parse_args()

    global DATA_PATH, NODE_IDS
    DATA_PATH = Path(args.data)
    tree = json.loads(Path(args.tree).read_text())
    NODE_IDS = {n["id"] for n in tree["nodes"]}

    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"tech-tree claims service on 127.0.0.1:{args.port}, "
          f"{len(NODE_IDS)} steps, data at {DATA_PATH}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
