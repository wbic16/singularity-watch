class K {
  constructor() {
    this.create_range = (e, s) => new O(e, s), this.default_coordinate = () => new _(), this.create_positioned_scroll = (e, s, t = "", i = "") => new d(e, s, new _(t), i), this.check_for_cowbell = (e) => {
      for (var s = 0; s < e.length; ++s)
        if (e[s] == this.MORE_COWBELL)
          return !0;
      return !1;
    }, this.get_subspace_coordinates = (e, s) => {
      for (var t = new _(), i = new _(), r = new _(), a = 0, n = 0, o = 0, h = 0, l = e.length; a < l; ) {
        var c = e[a];
        h == 0 && (t.equals(s) && (h = 1, n = a, i = this.to_coordinate(t.to_string()), r = this.to_coordinate(t.to_string())), t.less_than(s) && (i = this.to_coordinate(t.to_string()), r = this.to_coordinate(t.to_string()))), h < 2 && t.greater_than(s) && (h == 0 && (n = a - 1), o = a - 1, r = i, h = 2), this.is_phext_break(c) && (c == this.SCROLL_BREAK && t.scroll_break(), c == this.SECTION_BREAK && t.section_break(), c == this.CHAPTER_BREAK && t.chapter_break(), c == this.BOOK_BREAK && t.book_break(), c == this.VOLUME_BREAK && t.volume_break(), c == this.COLLECTION_BREAK && t.collection_break(), c == this.SERIES_BREAK && t.series_break(), c == this.SHELF_BREAK && t.shelf_break(), c == this.LIBRARY_BREAK && t.library_break()), ++a;
      }
      h == 1 && t.equals(s) && (o = l, r = t, h = 2), h == 0 && (n = l, o = l, r = t);
      var f = new x(n, o, r, i);
      return f;
    }, this.remove = (e, s) => {
      var t = this.replace(e, s, "");
      return this.normalize(t);
    }, this.create_summary = (e) => {
      var s = 32;
      if (e.length == 0)
        return "No Summary";
      const i = this.phokenize(e)[0].scroll.split(`
`)[0];
      i.length < 32 && (s = i.length);
      var r = i.substring(0, s);
      return r.length < e.length && (r += "..."), r;
    }, this.navmap = (e, s) => {
      const t = this.phokenize(s);
      var i = "";
      const r = t.length;
      r > 0 && (i += `<ul>
`);
      for (var a = 0; a < r; ++a) {
        const n = t[a], o = n.coord.to_urlencoded(), h = n.coord.to_string(), l = this.create_summary(n.scroll);
        i += `<li><a href="${e}${o}">${h} ${l}</a></li>
`;
      }
      return r > 0 && (i += `</ul>
`), i;
    }, this.textmap = (e) => {
      for (var s = this.phokenize(e), t = "", i = 0; i < s.length; ++i) {
        var r = s[i];
        t += `* ${r.coord.to_string()}: ${this.create_summary(r.scroll)}
`;
      }
      return t;
    }, this.soundex_internal = (e) => {
      for (var s = "bpfv", t = "cskgjqxz", i = "dt", r = "l", a = "mn", n = "r", o = 1, h = 0; h < e.length; ++h) {
        var l = e[h];
        if (s.indexOf(l) >= 0) {
          o += 1;
          continue;
        }
        if (t.indexOf(l) >= 0) {
          o += 2;
          continue;
        }
        if (i.indexOf(l) >= 0) {
          o += 3;
          continue;
        }
        if (r.indexOf(l) >= 0) {
          o += 4;
          continue;
        }
        if (a.indexOf(l) >= 0) {
          o += 5;
          continue;
        }
        if (n.indexOf(l) >= 0) {
          o += 6;
          continue;
        }
      }
      return o % 99;
    }, this.soundex_v1 = (e) => {
      for (var s = this.phokenize(e), t = "", i = new _(), r = 0; r < s.length; ++r) {
        const a = this.soundex_internal(s[r].scroll);
        t += i.advance_to(s[r].coord), t += a;
      }
      return t;
    }, this.index_phokens = (e) => {
      for (var s = this.phokenize(e), t = 0, i = new _(), r = new Array(), a = 0; a < s.length; ++a) {
        const n = i.advance_to(s[a].coord);
        t += n.length;
        const o = new _(i.to_string());
        r.push(new d(o, `${t}`, o, "")), t += s[a].scroll.length;
      }
      return r;
    }, this.index = (e) => {
      var s = this.index_phokens(e);
      return this.dephokenize(s);
    }, this.offset = (e, s) => {
      for (var t = this.index_phokens(e), i = new _(), r = !1, a = s, n = 0; n < t.length; ++n) {
        var o = t[n];
        (o.coord.less_than(s) || o.coord.equals(s)) && (i = o.coord), o.coord == s && (r = !0);
      }
      r == !1 && (a = i);
      let h = this.dephokenize(t);
      return parseInt(this.fetch(h, a));
    }, this.replace = (e, s, t) => {
      const i = this.phokenize(e);
      for (var r = new _(), a = "", n = t.length == 0, o = 0; o < i.length; ++o) {
        var h = i[o];
        h.coord.equals(s) ? n || (a += r.advance_to(s), a += t, n = !0) : (n == !1 && h.coord.greater_than(s) && (a += r.advance_to(s), a += t, n = !0), h.scroll.length > 0 && (a += r.advance_to(h.coord), a += h.scroll));
      }
      return n == !1 && (a += r.advance_to(s), a += t, n = !0), a;
    }, this.range_replace = (e, s, t) => {
      var i = this.get_subspace_coordinates(e, s.start), r = this.get_subspace_coordinates(e, s.end), a = i.start, n = r.end;
      const o = e.length;
      n > o && (n = o);
      const h = e.substring(0, a), l = e.substring(n);
      return h + t + l;
    }, this.insert = (e, s, t) => {
      var i = this.get_subspace_coordinates(e, s);
      const r = i.end;
      var a = "", n = i.coord;
      a += n.advance_to(s);
      const o = e.substring(0, r), h = e.substring(r);
      return o + a + t + h;
    }, this.next_scroll = (e, s) => {
      for (var t = s, i = "", r = "", a = 0, n = s, o = e.length; a < o; ) {
        var h = e[a], l = !1;
        if (h == this.SCROLL_BREAK && (t.scroll_break(), l = !0), h == this.SECTION_BREAK && (t.section_break(), l = !0), h == this.CHAPTER_BREAK && (t.chapter_break(), l = !0), h == this.BOOK_BREAK && (t.book_break(), l = !0), h == this.VOLUME_BREAK && (t.volume_break(), l = !0), h == this.COLLECTION_BREAK && (t.collection_break(), l = !0), h == this.SERIES_BREAK && (t.series_break(), l = !0), h == this.SHELF_BREAK && (t.shelf_break(), l = !0), h == this.LIBRARY_BREAK && (t.library_break(), l = !0), l) {
          if (i.length > 0) {
            a += 1;
            break;
          }
        } else
          n = new _(t.to_string()), i += e[a];
        ++a;
      }
      return a < o && (r = e.substring(a)), new d(n, i, t, r);
    }, this.phokenize = (e) => {
      for (var s = Array(), t = new _(), i = e; ; ) {
        var r = this.next_scroll(i, t);
        if (r.scroll.length == 0 || (s.push(r), t = r.next, i = r.remaining, r.remaining.length == 0))
          break;
      }
      return s;
    }, this.merge = (e, s) => {
      const t = this.phokenize(e), i = this.phokenize(s);
      var r = 0, a = 0;
      const n = t.length, o = i.length;
      for (var h = "", l = new _(); ; ) {
        const c = r < n, f = a < o, k = c && f && (t[r].coord.less_than(i[a].coord) || t[r].coord.equals(i[a].coord)), B = c && f && (i[a].coord.less_than(t[r].coord) || i[a].coord.equals(t[r].coord)), A = c && (f == !1 || k), b = f && (c == !1 || B);
        if (A && (h += this.append_scroll(t[r], l), l = new _(t[r].coord.to_string()), ++r), b && (h += this.append_scroll(i[a], l), l = new _(i[a].coord.to_string()), ++a), A == !1 && b == !1)
          break;
      }
      return h;
    }, this.fetch = (e, s) => {
      var t = this.get_subspace_coordinates(e, s), i = t.start, r = t.end;
      if (r > i) {
        var a = e.substring(i, r);
        return a;
      }
      return "";
    }, this.expand = (e) => {
      for (var s = "", t = 0; t < e.length; ++t) {
        var i = e[t];
        switch (i) {
          case this.LINE_BREAK:
            s += this.SCROLL_BREAK;
            break;
          case this.SCROLL_BREAK:
            s += this.SECTION_BREAK;
            break;
          case this.SECTION_BREAK:
            s += this.CHAPTER_BREAK;
            break;
          case this.CHAPTER_BREAK:
            s += this.BOOK_BREAK;
            break;
          case this.BOOK_BREAK:
            s += this.VOLUME_BREAK;
            break;
          case this.VOLUME_BREAK:
            s += this.COLLECTION_BREAK;
            break;
          case this.COLLECTION_BREAK:
            s += this.SERIES_BREAK;
            break;
          case this.SERIES_BREAK:
            s += this.SHELF_BREAK;
            break;
          case this.SHELF_BREAK:
            s += this.LIBRARY_BREAK;
            break;
          default:
            s += e[t];
            break;
        }
      }
      return s;
    }, this.contract = (e) => {
      for (var s = "", t = 0; t < e.length; ++t) {
        var i = e[t];
        switch (i) {
          // nop: case phext.LINE_BREAK
          case this.SCROLL_BREAK:
            s += this.LINE_BREAK;
            break;
          case this.SECTION_BREAK:
            s += this.SCROLL_BREAK;
            break;
          case this.CHAPTER_BREAK:
            s += this.SECTION_BREAK;
            break;
          case this.BOOK_BREAK:
            s += this.CHAPTER_BREAK;
            break;
          case this.VOLUME_BREAK:
            s += this.BOOK_BREAK;
            break;
          case this.COLLECTION_BREAK:
            s += this.VOLUME_BREAK;
            break;
          case this.SERIES_BREAK:
            s += this.COLLECTION_BREAK;
            break;
          case this.SHELF_BREAK:
            s += this.SERIES_BREAK;
            break;
          case this.LIBRARY_BREAK:
            s += this.SHELF_BREAK;
            break;
          default:
            s += e[t];
            break;
        }
      }
      return s;
    }, this.dephokenize = (e) => {
      for (var s = "", t = new _(), i = 0; i < e.length; ++i) {
        var r = e[i];
        r.scroll && r.scroll.length > 0 && (s += t.advance_to(r.coord), s += r.scroll);
      }
      return s;
    }, this.append_scroll = (e, s) => {
      var t = s.advance_to(e.coord);
      return t += e.scroll, t;
    }, this.subtract = (e, s) => {
      const t = this.phokenize(e), i = this.phokenize(s);
      var r = "", a = 0;
      const n = i.length;
      for (var o = new _(), h = 0; h < t.length; ++h) {
        var l = t[h], c = !1;
        if (a == n && (c = !0), a < n) {
          let f = i[a];
          l.coord.less_than(f.coord) ? c = !0 : l.coord.equals(f.coord) && ++a;
        }
        c && (r += this.append_scroll(l, o), o.advance_to(l.coord));
      }
      return r;
    }, this.is_phext_break = (e) => e == this.LINE_BREAK || e == this.SCROLL_BREAK || e == this.SECTION_BREAK || e == this.CHAPTER_BREAK || e == this.BOOK_BREAK || e == this.VOLUME_BREAK || e == this.COLLECTION_BREAK || e == this.SERIES_BREAK || e == this.SHELF_BREAK || e == this.LIBRARY_BREAK, this.normalize = (e) => {
      var s = this.phokenize(e);
      return this.dephokenize(s);
    }, this.to_coordinate = (e) => {
      for (var s = new _(), t = 0, i = 0, r = 10, a = 0; a < e.length; ++a) {
        var n = e[a];
        if (n == this.ADDRESS_MICRO_BREAK || n == this.ADDRESS_MACRO_BREAK || n == this.ADDRESS_MACRO_ALT) {
          switch (t) {
            case 1:
              s.z.library = i, t += 1;
              break;
            case 2:
              s.z.shelf = i, t += 1;
              break;
            case 3:
              s.z.series = i, t += 1;
              break;
            case 4:
              s.y.collection = i, t += 1;
              break;
            case 5:
              s.y.volume = i, t += 1;
              break;
            case 6:
              s.y.book = i, t += 1;
              break;
            case 7:
              s.x.chapter = i, t += 1;
              break;
            case 8:
              s.x.section = i, t += 1;
              break;
          }
          i = 0;
        }
        n >= "0" && n <= "9" && (i = r * i + parseInt(n), t == 0 && (t = 1));
      }
      return t > 0 && (s.x.scroll = i), s;
    }, this.COORDINATE_MINIMUM = 1, this.COORDINATE_MAXIMUM = 100, this.LIBRARY_BREAK = "", this.MORE_COWBELL = "\x07", this.LINE_BREAK = `
`, this.SCROLL_BREAK = "", this.SECTION_BREAK = "", this.CHAPTER_BREAK = "", this.BOOK_BREAK = "", this.VOLUME_BREAK = "", this.COLLECTION_BREAK = "", this.SERIES_BREAK = "", this.SHELF_BREAK = "", this.ADDRESS_MICRO_BREAK = ".", this.ADDRESS_MACRO_BREAK = "/", this.ADDRESS_MACRO_ALT = ";";
  }
}
class _ {
  constructor(e = "") {
    if (this.equals = (t) => this.z.library == t.z.library && this.z.shelf == t.z.shelf && this.z.series == t.z.series && this.y.collection == t.y.collection && this.y.volume == t.y.volume && this.y.book == t.y.book && this.x.chapter == t.x.chapter && this.x.section == t.x.section && this.x.scroll == t.x.scroll, this.less_than = (t) => this.z.library < t.z.library ? !0 : this.z.library > t.z.library ? !1 : this.z.shelf < t.z.shelf ? !0 : this.z.shelf > t.z.shelf ? !1 : this.z.series < t.z.series ? !0 : this.z.series > t.z.series ? !1 : this.y.collection < t.y.collection ? !0 : this.y.collection > t.y.collection ? !1 : this.y.volume < t.y.volume ? !0 : this.y.volume > t.y.volume ? !1 : this.y.book < t.y.book ? !0 : this.y.book > t.y.book ? !1 : this.x.chapter < t.x.chapter ? !0 : this.x.chapter > t.x.chapter ? !1 : this.x.section < t.x.section ? !0 : this.x.section > t.x.section ? !1 : this.x.scroll < t.x.scroll, this.greater_than = (t) => this.z.library > t.z.library ? !0 : this.z.library < t.z.library ? !1 : this.z.shelf > t.z.shelf ? !0 : this.z.shelf < t.z.shelf ? !1 : this.z.series > t.z.series ? !0 : this.z.series < t.z.series ? !1 : this.y.collection > t.y.collection ? !0 : this.y.collection < t.y.collection ? !1 : this.y.volume > t.y.volume ? !0 : this.y.volume < t.y.volume ? !1 : this.y.book > t.y.book ? !0 : this.y.book < t.y.book ? !1 : this.x.chapter > t.x.chapter ? !0 : this.x.chapter < t.x.chapter ? !1 : this.x.section > t.x.section ? !0 : this.x.section < t.x.section ? !1 : this.x.scroll > t.x.scroll, this.advance_to = (t) => {
      for (var i = ""; this.less_than(t); ) {
        if (this.z.library < t.z.library) {
          i += u.LIBRARY_BREAK, this.library_break();
          continue;
        }
        if (this.z.shelf < t.z.shelf) {
          i += u.SHELF_BREAK, this.shelf_break();
          continue;
        }
        if (this.z.series < t.z.series) {
          i += u.SERIES_BREAK, this.series_break();
          continue;
        }
        if (this.y.collection < t.y.collection) {
          i += u.COLLECTION_BREAK, this.collection_break();
          continue;
        }
        if (this.y.volume < t.y.volume) {
          i += u.VOLUME_BREAK, this.volume_break();
          continue;
        }
        if (this.y.book < t.y.book) {
          i += u.BOOK_BREAK, this.book_break();
          continue;
        }
        if (this.x.chapter < t.x.chapter) {
          i += u.CHAPTER_BREAK, this.chapter_break();
          continue;
        }
        if (this.x.section < t.x.section) {
          i += u.SECTION_BREAK, this.section_break();
          continue;
        }
        if (this.x.scroll < t.x.scroll) {
          i += u.SCROLL_BREAK, this.scroll_break();
          continue;
        }
      }
      return i;
    }, this.validate_index = (t) => t >= u.COORDINATE_MINIMUM && t <= u.COORDINATE_MAXIMUM, this.validate_coordinate = () => this.validate_index(this.z.library) && this.validate_index(this.z.shelf) && this.validate_index(this.z.series) && this.validate_index(this.y.collection) && this.validate_index(this.y.volume) && this.validate_index(this.y.book) && this.validate_index(this.x.chapter) && this.validate_index(this.x.section) && this.validate_index(this.x.scroll), this.to_string = () => `${this.z.library}.${this.z.shelf}.${this.z.series}/${this.y.collection}.${this.y.volume}.${this.y.book}/${this.x.chapter}.${this.x.section}.${this.x.scroll}`, this.to_urlencoded = () => this.to_string().replace(/\//g, ";"), this.advance_coordinate = (t) => {
      var i = t + 1;
      return i < u.COORDINATE_MAXIMUM ? i : t;
    }, this.library_break = () => {
      this.z.library = this.advance_coordinate(this.z.library), this.z.shelf = 1, this.z.series = 1, this.y = new R(), this.x = new E();
    }, this.shelf_break = () => {
      this.z.shelf = this.advance_coordinate(this.z.shelf), this.z.series = 1, this.y = new R(), this.x = new E();
    }, this.series_break = () => {
      this.z.series = this.advance_coordinate(this.z.series), this.y = new R(), this.x = new E();
    }, this.collection_break = () => {
      this.y.collection = this.advance_coordinate(this.y.collection), this.y.volume = 1, this.y.book = 1, this.x = new E();
    }, this.volume_break = () => {
      this.y.volume = this.advance_coordinate(this.y.volume), this.y.book = 1, this.x = new E();
    }, this.book_break = () => {
      this.y.book = this.advance_coordinate(this.y.book), this.x = new E();
    }, this.chapter_break = () => {
      this.x.chapter = this.advance_coordinate(this.x.chapter), this.x.section = 1, this.x.scroll = 1;
    }, this.section_break = () => {
      this.x.section = this.advance_coordinate(this.x.section), this.x.scroll = 1;
    }, this.scroll_break = () => {
      this.x.scroll = this.advance_coordinate(this.x.scroll);
    }, this.z = new y(1, 1, 1), this.y = new R(1, 1, 1), this.x = new E(1, 1, 1), e.length > 0) {
      var s = e.replace(/\//g, ".").split(".");
      s.length >= 1 && (this.z.library = parseInt(s[0]), this.z.library < 1 && (this.z.library = 1)), s.length >= 2 && (this.z.shelf = parseInt(s[1]), this.z.shelf < 1 && (this.z.shelf = 1)), s.length >= 3 && (this.z.series = parseInt(s[2]), this.z.series < 1 && (this.z.series = 1)), s.length >= 4 && (this.y.collection = parseInt(s[3]), this.y.collection < 1 && (this.y.collection = 1)), s.length >= 5 && (this.y.volume = parseInt(s[4]), this.y.volume < 1 && (this.y.volume = 1)), s.length >= 6 && (this.y.book = parseInt(s[5]), this.y.book < 1 && (this.y.book = 1)), s.length >= 7 && (this.x.chapter = parseInt(s[6]), this.x.chapter < 1 && (this.x.chapter = 1)), s.length >= 8 && (this.x.section = parseInt(s[7]), this.x.section < 1 && (this.x.section = 1)), s.length >= 9 && (this.x.scroll = parseInt(s[8]), this.x.scroll < 1 && (this.x.scroll = 1));
    }
  }
}
var u = new K();
class x {
  constructor(e, s, t, i) {
    this.start = e, this.end = s, this.coord = t, this.fallback = i;
  }
}
class d {
  constructor(e, s, t, i) {
    this.coord = e, this.scroll = s, this.next = t, this.remaining = i;
  }
}
class O {
  constructor(e, s) {
    this.start = e, this.end = s;
  }
}
class y {
  constructor(e = 1, s = 1, t = 1) {
    this.library = e, this.shelf = s, this.series = t;
  }
}
class R {
  constructor(e = 1, s = 1, t = 1) {
    this.collection = e, this.volume = s, this.book = t;
  }
}
class E {
  constructor(e = 1, s = 1, t = 1) {
    this.chapter = e, this.section = s, this.scroll = t;
  }
}
export {
  _ as Coordinate,
  K as Phext
};
