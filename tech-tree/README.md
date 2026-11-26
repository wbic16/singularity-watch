# The Kardashev 2.0 Tech Tree — how this page works

Live at https://singularitywatch.org/tech-tree (task 32.5.10/7.5.10/6.5.9).

## Files

- `index.html` — the page. Self-contained; the tree is rendered
  statically from `tree.json` (edit the JSON, regenerate, never
  hand-edit the HTML). Theme: the homepage's CSS variable system,
  dark default, `sw-theme` localStorage key shared with the homepage.
- `tree.json` — the tree itself: eras and nodes (name, window,
  prerequisites, what it unlocks). The DAG is checked before every
  publish: no dangling prerequisites, no cycles, windows sane.
- `claims-server.py` — the completion-claims service (Python stdlib
  only). Visitors mark a step complete by submitting a claimant
  name/handle and an **evidence URL** (required, validated as an
  http(s) URL). Claims are stored and rendered back labeled as
  community-submitted claims — not editorially verified fact. No
  accounts, no voting, no moderation queue.
- `tech-tree-claims.service` — the systemd **user** unit that runs it.

## Service operations (awsbox)

- Runs as wbic16's user service (linger is on):
  `systemctl --user status tech-tree-claims`
- Listens on 127.0.0.1:8919 only. Data file (outside this checkout, so
  deploys can never clobber it): `~/tech-tree-data/claims.json`
- Endpoints (behind the nginx prefix below):
  `GET /tech-tree/api/claims`, `POST /tech-tree/api/claim`
  with JSON `{"node", "claimant", "evidence"}`.

## The one root step: nginx

The vhost `/etc/nginx/sites-available/singularitywatch.org` needs this
block inside the 443 server, after the `location /` block (validated
in a copied-tree harness with positive and negative controls before
install; see the task record):

```nginx
    # Tech Tree completion claims (task 32.5.10/7.5.10/6.5.9): the
    # claims service runs as a user service on 127.0.0.1:8919.
    location /tech-tree/api/ {
        proxy_pass http://127.0.0.1:8919/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
```

Install: back up the vhost, insert the block, `nginx -t` (must print
"test is successful"), then `systemctl reload nginx`. Rollback:
restore the backup, `nginx -t`, reload.
