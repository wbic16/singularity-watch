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

// todo: merge libphext-node and replace most of this code
// see: https://github.com/wbic16/libphext-node

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

var ramBuffer = Array();
const SLICE_LIMIT = 64000000; // 64 M x 1 MB = 64 TB
function load(arr, slice) {
  if (slice > SLICE_LIMIT) {
    return "";
  }
  if (!arr[slice]) {
    arr[slice] = "";
  }
  return arr[slice];
}

function store(arr, slice, buffer) {
  arr[slice] = buffer;
}

var phext = Array();
var loaded = defaultCoordinate();
function loadLibrary() {
  return loadLibrary(loaded.lb, false);
}
function loadLibrary(library, update = true) {
  if (!phext[library]) {
    phext[library] = Array();
  }
  if (update) {
    loaded.lb = library;
  }
  return phext[library];
}
function storeLibrary(library, buffer) {
  phext[library] = buffer;
  loaded.lb = library;
}

function loadShelf() {
  return loadShelf(loaded.sf, false);
}
function loadShelf(shelf, update = true) {
  var library = loadLibrary();
  if (!library[shelf]) {
    library[shelf] = Array();
  }
  if (update) {
    loaded.sf = shelf;
  }
  return library[shelf];
}
function storeShelf(shelf, buffer) {
  var library = loadLibrary();
  library[shelf] = buffer;
  loaded.sf = shelf;
}

function loadSeries() {
  return loadSeries(loaded.sr, false);
}
function loadSeries(series, update = true) {
  var shelf = loadShelf();
  if (!shelf[series]) {
    shelf[series] = Array();
  }
  if (update) {
    loaded.sr = series;
  }
  return shelf[series];
}
function storeSeries(series, buffer) {
  var shelf = loadShelf();
  shelf[series] = buffer;
  loaded.sr = series;
}

function loadCollection() {
  return loadCollection(loaded.cn, false);
}
function loadCollection(collection, update = true) {
  var series = loadSeries();
  if (!series[collection]) {
    series[collection] = Array();
  }
  if (update) {
    loaded.cn = collection;
  }
  return series[collection];
}
function storeCollection(collection, buffer) {
  var series = loadSeries();
  series[collection] = buffer;
  loaded.cn = collection;
}

function loadVolume() {
  return loadVolume(loaded.vm, false);
}
function loadVolume(volume, update = true) {
  var collection = loadCollection();
  if (!collection[volume]) {
    collection[volume] = Array();
  }
  if (update) {
    loaded.vm = volume;
  }
  return collection[volume];
}
function storeVolume(volume, buffer) {
  var collection = loadCollection();
  collection[volume] = buffer;
  loaded.vm = volume;
}

function loadBook() {
  return loadBook(loaded.bk, false);
}
function loadBook(book, update = true) {
  var volume = loadVolume();
  if (!volume[book]) {
    volume[book] = Array();
  }
  if (update) {
    loaded.bk = book;
  }
  return volume[book];
}
function storeBook(book, buffer) {
  var volume = loadVolume();
  volume[book] = buffer;
  loaded.bk = book;
}

function loadChapter() {
  return loadChapter(loaded.ch, false);
}
function loadChapter(chapter, update = true) {
  var book = loadBook();
  if (!book[chapter]) {
    book[chapter] = Array();
  }
  if (update) {
    loaded.ch = chapter;
  }
  return book[chapter];
}
function storeBook(chapter, buffer) {
  var book = loadBook();
  book[chapter] = buffer;
  loaded.ch = chapter;
}

function loadSection() {
  return loadSection(loaded.sn, false);
}
function loadSection(section, update = true) {
  var chapter = loadChapter();
  if (!chapter[section]) {
    chapter[section] = Array();
  }
  if (update) {
    loaded.sn = section;
  }
  return chapter[section];
}
function storeSection(section, buffer) {
  var chapter = loadChapter();
  chapter[section] = buffer;
  loaded.sn = section;
}

function loadScroll() {
  return loadScroll(loaded.sc, false);
}
function loadScroll(scroll, update = true) {
  var section = loadSection();
  if (!section[scroll]) {
    section[scroll] = Array();
  }
  if (update) {
    loaded.sc = scroll;
  }
  return section[scroll];
}
function storeScroll(scroll, buffer) {
  var section = loadSection();
  section[scroll] = buffer;
  loaded.sc = scroll;
}