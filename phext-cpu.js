// See: https://www.phext.io/phextio.ts for more info about phext!
const LINE_BREAK       = '\n';   // 2nd (Newline)
const SCROLL_BREAK     = '\x17'; // 3rd
const SECTION_BREAK    = '\x18'; // 4th
const CHAPTER_BREAK    = '\x19'; // 5th
const BOOK_BREAK       = '\x1A'; // 6th
const VOLUME_BREAK     = '\x1C'; // 7th
const COLLECTION_BREAK = '\x1D'; // 8th
const SERIES_BREAK     = '\x1E'; // 9th
const SHELF_BREAK      = '\x1F'; // 10th
const LIBRARY_BREAK    = '\x01'; // 11th

function isPhextBreak(type) {
  return type == SCROLL_BREAK ||
         type == SECTION_BREAK ||
         type == CHAPTER_BREAK ||
         type == BOOK_BREAK ||
         type == VOLUME_BREAK ||
         type == COLLECTION_BREAK ||
         type == SERIES_BREAK ||
         type == SHELF_BREAK ||
         type == LIBRARY_BREAK;
}

function defaultCoordinate() {
  return {
    "lb": 1, "sf": 1, "sr": 1,
    "cn": 1, "vm": 1, "bk": 1,
    "ch": 1, "sn": 1, "sc": 1
  };
}

function parseCharacter(type, coord) {
  switch (type) {
    case SCROLL_BREAK:
      ++coord.sc;
      break;
    case SECTION_BREAK:
      coord.sc=1;
      ++coord.sn;
      break;
    case CHAPTER_BREAK:
      coord.sc=1;
      coord.sn=1;
      ++coord.ch;
      break;
    case BOOK_BREAK:
      coord.sc=1;
      coord.sn=1;
      coord.ch=1;
      ++coord.bk;
      break;
    case VOLUME_BREAK:
      coord.sc=1;
      coord.sn=1;
      coord.ch=1;
      coord.bk=1;
      ++coord.vm;
      break;
    case COLLECTION_BREAK:
      coord.sc=1;
      coord.sn=1;
      coord.ch=1;
      coord.bk=1;
      coord.vm=1;
      ++coord.cn;
      break;
    case SERIES_BREAK:
      coord.sc=1;
      coord.sn=1;
      coord.ch=1;
      coord.bk=1;
      coord.vm=1;
      coord.cn=1;
      ++coord.sr;
      break;
    case SHELF_BREAK:
      coord.sc=1;
      coord.sn=1;
      coord.ch=1;
      coord.bk=1;
      coord.vm=1;
      coord.cn=1;
      coord.sr=1;
      ++coord.sf;
      break;
    case LIBRARY_BREAK:
      coord.sc=1;
      coord.sn=1;
      coord.ch=1;
      coord.bk=1;
      coord.vm=1;
      coord.cn=1;
      coord.sr=1;
      coord.sf=1;
      ++coord.lb;
      break;
  }
}

function equals(left, right) {
  return left.sc == right.sc &&
         left.sn == right.sn &&
         left.ch == right.ch &&
         left.bk == right.bk &&
         left.vm == right.vm &&
         left.cn == right.cn &&
         left.sr == right.sr &&
         left.sf == right.sf &&
         left.lb == right.lb;
}

function lessThan(left, right) {
  return left.lb < right.lb ||
         left.sf < right.sf ||
         left.sr < right.sr ||
         left.cn < right.cn ||
         left.vm < right.vm ||
         left.bk < right.bk ||
         left.ch < right.ch ||
         left.sn < right.sn ||
         left.sc < right.sc;
}

function concatenate(left, right) {
  return left + right;
}

function shouldRead(leftCoordinate, rightCoordinate) {
  return lessThan(leftCoordinate, rightCoordinate) || equals(leftCoordinate, rightCoordinate);
}

function merge(left, right) {
  var lc = defaultCoordinate();
  var rc = defaultCoordinate();
  var loc = defaultCoordinate();

  var lpos = 0;
  var rpos = 0;
  var done = false;
  var ltok = '';
  var rtok = '';
  var output = '';
 
  while (!done) {
    var lbreak = false;
    var rbreak = false;
    var priorLength = output.length;
    while ((lpos < left.length) && (rpos == right.length || shouldRead(lc, rc))) {
      ltok = left[lpos];
      parseCharacter(ltok, lc);
      ++lpos;
      if (isPhextBreak(ltok)) {
        lbreak = true;
        break;
      }
      output += ltok;
    }
    while ((rpos < right.length) && (lpos == left.length || shouldRead(rc, lc))) {
      rtok = right[rpos];
      parseCharacter(rtok, rc);
      ++rpos;
      if (isPhextBreak(rtok)) {
        rbreak = true;
        break;
      }
      output += rtok;
    }

    if (lbreak) {
      output += ltok;
    }
    if (rbreak && ltok != rtok) {
      output += rtok;
    }

    done = priorLength == output.length;
  }
  return output;
}

function select(address, buffer) {
  // TODO: inspect `buffer` to locate the scroll at `address`
}

function apply(transform, buffer) {
  // TODO: apply `transform` to each scroll embedded in `buffer`
}

function expand(buffer) {
  // TODO: expand every line into a scroll
}

function contract(buffer) {
  // TODO: contract every scroll into a line
}

function append(address, text, buffer) {
  // TODO: append the text at `address` in the given phext buffer
}

function replace(address, text, buffer) {
  // TODO: overwrite the contents of `buffer` at the given address with `text`
}

function load(slice) {
  // TODO: return the 1MB slice from RAM
}

function store(slice, buffer) {
  // TODO: store the 1MB slice into RAM
}