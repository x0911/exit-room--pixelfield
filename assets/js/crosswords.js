/* eslint-disable */

!(function (e) {
  var t = {};
  function r(n) {
    if (t[n]) return t[n].exports;
    var l = (t[n] = { i: n, l: !1, exports: {} });
    return e[n].call(l.exports, l, l.exports, r), (l.l = !0), l.exports;
  }
  (r.m = e),
    (r.c = t),
    (r.d = function (e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
    }),
    (r.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (r.t = function (e, t) {
      if ((1 & t && (e = r(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if (
        (r.r(n),
        Object.defineProperty(n, 'default', { enumerable: !0, value: e }),
        2 & t && 'string' != typeof e)
      )
        for (var l in e)
          r.d(
            n,
            l,
            function (t) {
              return e[t];
            }.bind(null, l)
          );
      return n;
    }),
    (r.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return r.d(t, 'a', t), t;
    }),
    (r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (r.p = ''),
    r((r.s = 0));
})([
  function (e, t, r) {
    const n = r(1),
      l = r(3);
    r(6);
    const o = { compileCrossword: n, CrosswordDOM: l };
    'undefined' != typeof window && (window.CrosswordsJS = o), (e.exports = o);
  },
  function (e, t, r) {
    const n = r(2);
    function l(e, t) {
      let r = t;
      for (let t = 0; t < e.length; t++) {
        if (r <= e[t].length) return [e[t], r];
        r -= e[t].length;
      }
    }
    e.exports = function (e) {
      if (!e)
        throw new Error(
          'The Crossword must be initialised with a crossword definition.'
        );
      const t = {
        width: e.width,
        height: e.height,
        acrossClues: [],
        downClues: [],
        cells: [],
      };
      if (
        void 0 === t.width ||
        null === t.width ||
        t.width < 0 ||
        void 0 === t.height ||
        null === t.height ||
        t.height < 0
      )
        throw new Error('The crossword bounds are invalid.');
      t.cells = (function (e) {
        const t = e.width,
          r = e.height,
          n = new Array(t);
        for (let t = 0; t < r; t++) {
          n[t] = new Array(r);
          for (let l = 0; l < r; l++) n[t][l] = { crossword: e, x: t, y: l };
        }
        return n;
      })(t);
      const r = e.acrossClues.concat(e.downClues);
      for (let o = 0; o < r.length; o++) {
        const s = r[o],
          c = o < e.acrossClues.length,
          u = n(s.clue);
        if (
          ((u.code = u.number + (c ? 'a' : 'd')),
          (u.answer = s.answer),
          (u.x = s.x - 1),
          (u.y = s.y - 1),
          (u.across = c),
          (u.cells = []),
          (u.clueLabel = u.number + '.'),
          t[c ? 'acrossClues' : 'downClues'].push(u),
          u.x < 0 || u.x >= t.width || u.y < 0 || u.y >= t.height)
        )
          throw new Error(`Clue ${u.code} doesn't start in the bounds.`);
        if (c) {
          if (u.x + u.totalLength > t.width)
            throw new Error(`Clue ${u.code} exceeds horizontal bounds.`);
        } else if (u.y + u.totalLength > t.height)
          throw new Error(`Clue ${u.code} exceeds vertical bounds.`);
        let { x: a, y: i } = u;
        for (let e = 0; e < u.totalLength; e++) {
          const r = t.cells[a][i];
          (r.light = !0),
            (r[c ? 'acrossClue' : 'downClue'] = u),
            (r[c ? 'acrossClueLetterIndex' : 'downClueLetterIndex'] = e),
            u.cells.push(r);
          const [n, o] = l(u.answerStructure, e);
          if (
            (o === n.length - 1 &&
              '' !== n.terminator &&
              (r[u.across ? 'acrossTerminator' : 'downTerminator'] =
                n.terminator),
            u.answer)
          ) {
            if (
              void 0 !== r.answer &&
              ' ' !== r.answer &&
              r.answer !== u.answer[e]
            )
              throw new Error(
                `Clue ${u.code} answer at (${a + 1}, ${
                  i + 1
                }) is not coherent with previous clue (${
                  r.acrossClue.code
                }) answer.`
              );
            r.answer = u.answer[e];
          }
          if (0 === e) {
            if (r.clueLabel && r.clueLabel !== u.number)
              throw new Error(
                `Clue ${u.code} has a label which is inconsistent with another clue (${r.acrossClue.code}).`
              );
            r.clueLabel = u.number;
          }
          c ? a++ : i++;
        }
      }
      return (
        t.acrossClues.concat(t.downClues).forEach((e) => {
          if (!e.connectedClueNumbers) return;
          (e.connectedClues = e.connectedClueNumbers.map((e) =>
            'across' === e.direction
              ? t.acrossClues.find((t) => t.number === e.number)
              : 'down' === e.direction
              ? t.downClues.find((t) => t.number === e.number)
              : t.acrossClues.find((t) => t.number === e.number) ||
                t.downClues.find((t) => t.number === e.number)
          )),
            (e.answerStructureText =
              '(' +
              [e.answerStructureText]
                .concat(e.connectedClues.map((e) => e.answerStructureText))
                .join(',')
                .replace(/[()]/g, '') +
              ')');
          let r = 0;
          const n = [e].concat(e.connectedClues);
          n.forEach((e) => {
            r > 0 && (e.previousClueSegment = n[r - 1]),
              r < n.length - 1 && (e.nextClueSegment = n[r + 1]),
              (e.parentClue = n[0]),
              r++;
          }),
            (e.clueLabel =
              [e.number]
                .concat(e.connectedClues.map((e) => e.number))
                .join(',') + '.'),
            e.connectedClues.forEach((e) => {
              (e.answerStructureText = null), (e.isConnectedClue = !0);
            });
        }),
        t
      );
    };
  },
  function (e, t) {
    const r = new RegExp(/^(\d+),?([\dad,]*).[\s]*(.*)[\s]*\(([\d,-]+)\)$/);
    e.exports = function (e) {
      if (!e) throw new Error("'clue' is required");
      if (!r.test(e))
        throw new Error(
          `Clue '${e}' does not meet the required structured '<Number>. Clue Text (<Answer structure>)'`
        );
      const [, t, n, l, o] = r.exec(e),
        s = parseInt(t, 10);
      let c = null;
      n &&
        (c = n.split(',').map((e) => {
          return {
            number: parseInt(e, 10),
            direction:
              ((t = e), /a$/.test(t) ? 'across' : /d$/.test(t) ? 'down' : null),
          };
          var t;
        }));
      const u = [],
        a = new RegExp(/([\d]+)([,-]?)(.*)/);
      let i = o;
      for (; a.test(i); ) {
        const [, e, t, r] = a.exec(i);
        u.push({ length: parseInt(e, 10), terminator: t }), (i = r);
      }
      const d = u.reduce((e, t) => e + t.length, 0),
        C = `(${u.map((e) => `${e.length}${e.terminator}`).join('')})`;
      return {
        number: s,
        clue: l,
        connectedClueNumbers: c,
        answerStructure: u,
        answerStructureText: C,
        totalLength: d,
      };
    };
  },
  function (e, t, r) {
    const n = r(4),
      { removeClass: l, addClass: o } = r(5);
    const s = new n();
    function c(e, t, r) {
      const { document: n } = e;
      (this.crossword = t), (this.parentElement = r);
      const l = n.createElement('div');
      l.className = 'crossword';
      for (let e = 0; e < t.height; e++) {
        const r = n.createElement('div');
        (r.className = 'cwrow'), l.appendChild(r);
        for (let l = 0; l < t.width; l++) {
          const o = t.cells[l][e],
            c = this._createCellDOM(n, o);
          r.appendChild(c), s.add(o, c);
        }
      }
      const o = (e) => {
        const t = e.children[0].children[0].clientWidth;
        e.style.fontSize = 0.6 * t + 'px';
      };
      e.addEventListener('resize', () => o(l)),
        r.appendChild(l),
        o(l),
        (this.updateFontSize = () => o(l)),
        (this.crosswordElement = l);
    }
    (c.prototype.selectClue = function (e) {
      (this.currentClue = e),
        this._updateDOM(),
        s.getCellElement(e.cells[0]).focus(),
        this._stateChange('clueSelected');
    }),
      (c.prototype.destroy = function () {
        s.removeCrosswordCells(this.crossword),
          this.parentElement.removeChild(this.crosswordElement),
          (this.onStateChanged = null);
      }),
      (c.prototype._stateChange = function (e, t) {
        const r = this.onStateChanged;
        r && r({ message: e, data: t });
      }),
      (c.prototype._createCellDOM = function (e, t) {
        const r = this,
          n = e.createElement('div');
        if (
          ((n.className = 'cwcell'),
          (t.cellElement = n),
          (n.className += t.light ? ' light' : ' dark'),
          !t.light)
        )
          return n;
        const l = e.createElement('input');
        if (
          ((l.maxLength = 1),
          t.answer && (l.value = t.answer),
          n.appendChild(l),
          t.clueLabel)
        ) {
          const r = e.createElement('div');
          (r.className = 'cwcluelabel'),
            (r.innerHTML = t.clueLabel),
            n.appendChild(r);
        }
        if (',' === t.acrossTerminator)
          l.className += ' cw-across-word-separator';
        else if ('-' === t.acrossTerminator) {
          const t = e.createElement('div');
          (t.className = 'cw-across-terminator'),
            (t.innerHTML = '|'),
            n.appendChild(t);
        } else if (',' === t.downTerminator)
          l.className += ' cw-down-word-separator';
        else if ('-' === t.downTerminator) {
          const t = e.createElement('div');
          (t.className = 'cw-down-terminator'),
            (t.innerHTML = '|'),
            n.appendChild(t);
        }
        return (
          l.addEventListener('focus', (e) => {
            const t = e.target.parentNode,
              n = s.getCell(t),
              { crossword: l } = n,
              o = n.acrossClue,
              c = n.downClue;
            (!r.currentClue || (r.currentClue !== o && r.currentClue !== c)) &&
              ((o && !c) || (!o && c)
                ? (r.currentClue = o || c)
                : o &&
                  r.currentClue &&
                  (o === r.currentClue.previousClueSegment ||
                    o === r.nextClueSegment)
                ? (r.currentClue = o)
                : !r.currentClue ||
                  (c !== r.currentClue.previousClueSegment &&
                    c !== r.nextClueSegment)
                ? (r.currentClue =
                    0 === n.downClueLetterIndex && 0 !== n.acrossClueLetterIndex
                      ? c
                      : o)
                : (r.currentClue = c),
              r._updateDOM(),
              r._stateChange('clueSelected'));
          }),
          n.addEventListener('keydown', (e) => {
            if (8 === e.keyCode) {
              e.preventDefault(), (e.target.value = '');
              var t = e.target.parentNode;
              const l =
                  (n = s.getCell(t)).acrossClue === r.currentClue
                    ? n.acrossClueLetterIndex
                    : n.downClueLetterIndex,
                c = l - 1;
              c >= 0 &&
                r.currentClue.cells[c].cellElement
                  .querySelector('input')
                  .focus(),
                0 === l &&
                  r.currentClue.previousClueSegment &&
                  ((o = r.currentClue.previousClueSegment.cells),
                  0 === o.length ? o[0] : o[o.length - 1]).cellElement
                    .querySelector('input')
                    .focus();
            } else if (9 === e.keyCode) {
              e.preventDefault();
              t = e.target.parentNode;
              var n = s.getCell(t),
                { crossword: l } = n;
              const o = r.currentClue,
                c = o.across ? l.acrossClues : l.downClues;
              for (let t = 0; t < c.length; t++)
                if (o === c[t]) {
                  let n = null;
                  (n = e.shiftKey
                    ? t > 0
                      ? c[t - 1]
                      : o.across
                      ? l.downClues[l.downClues.length - 1]
                      : l.acrossClues[l.acrossClues.length - 1]
                    : t < c.length - 1
                    ? c[t + 1]
                    : o.across
                    ? l.downClues[0]
                    : l.acrossClues[0]),
                    (r.currentClue = n),
                    r._updateDOM(),
                    s.getCellElement(n.cells[0]).querySelector('input').focus();
                  break;
                }
            } else if (13 === e.keyCode) {
              e.preventDefault();
              (t = e.target.parentNode), (n = s.getCell(t));
              var { crossword: l } = n;
              n.acrossClue &&
                n.downClue &&
                ((r.currentClue =
                  n.acrossClue === r.currentClue ? n.downClue : n.acrossClue),
                r._updateDOM());
            }
            var o;
          }),
          n.addEventListener('keypress', (e) => {
            32 === e.keyCode && e.preventDefault(), (e.target.value = '');
            const t = e.target.parentNode,
              n = s.getCell(t),
              { crossword: l } = n,
              o = r.currentClue;
            function c(e, t, r) {
              let n = null == e ? '' : e,
                l = '';
              for (; n.length <= t; ) n += ' ';
              const o = Math.max(t, n.length);
              for (let e = 0; e < o; e++) l += e === t ? r : n[e];
              return l;
            }
            const u = String.fromCharCode(e.keyCode);
            n.acrossClue &&
              (n.acrossClue.answer = c(
                n.acrossClue.answer,
                n.acrossClueLetterIndex,
                u
              )),
              n.downClue &&
                (n.downClue.answer = c(
                  n.downClue.answer,
                  n.downClueLetterIndex,
                  u
                ));
            const a =
              (n.acrossClue === o
                ? n.acrossClueLetterIndex
                : n.downClueLetterIndex) + 1;
            a < o.cells.length &&
              o.cells[a].cellElement.querySelector('input').focus(),
              a === o.cells.length &&
                o.nextClueSegment &&
                o.nextClueSegment.cells[0].cellElement
                  .querySelector('input')
                  .focus();
          }),
          n.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
              case 37:
                var t = e.target.parentNode,
                  r = s.getCell(t),
                  { x: n, y: l } = r;
                r.x > 0 &&
                  !0 === r.crossword.cells[n - 1][l].light &&
                  s
                    .getCellElement(r.crossword.cells[n - 1][l])
                    .querySelector('input')
                    .focus();
                break;
              case 38:
                (t = e.target.parentNode), (r = s.getCell(t));
                var { x: n, y: l } = r;
                r.y > 0 &&
                  !0 === r.crossword.cells[n][l - 1].light &&
                  s
                    .getCellElement(r.crossword.cells[n][l - 1])
                    .querySelector('input')
                    .focus();
                break;
              case 39:
                (t = e.target.parentNode), (r = s.getCell(t));
                var { width: o } = r.crossword,
                  { x: n, y: l } = r;
                r.x + 1 < o &&
                  !0 === r.crossword.cells[n + 1][l].light &&
                  s
                    .getCellElement(r.crossword.cells[n + 1][l])
                    .querySelector('input')
                    .focus();
                break;
              case 40:
                (t = e.target.parentNode), (r = s.getCell(t));
                var { height: c } = r.crossword,
                  { x: n, y: l } = r;
                r.y + 1 < c &&
                  !0 === r.crossword.cells[n][l + 1].light &&
                  s
                    .getCellElement(r.crossword.cells[n][l + 1])
                    .querySelector('input')
                    .focus();
            }
          }),
          n
        );
      }),
      (c.prototype._updateDOM = function () {
        const e = this.currentClue,
          { crossword: t } = this;
        t.cells.forEach((e) => {
          e.forEach((e) => {
            e.light && l(s.getCellElement(e).querySelector('input'), 'active');
          });
        });
        (e.parentClue
          ? [e.parentClue].concat(e.parentClue.connectedClues)
          : [e]
        ).forEach((e) => {
          e.cells.forEach((e) => {
            o(s.getCellElement(e).querySelector('input'), 'active');
          });
        });
      }),
      (e.exports = c);
  },
  function (e, t) {
    function r() {
      this.map = [];
    }
    (r.prototype.add = function (e, t) {
      this.map.push({ cell: e, cellElement: t });
    }),
      (r.prototype.getCellElement = function (e) {
        for (let t = 0; t < this.map.length; t++)
          if (this.map[t].cell === e) return this.map[t].cellElement;
        return null;
      }),
      (r.prototype.getCell = function (e) {
        for (let t = 0; t < this.map.length; t++)
          if (this.map[t].cellElement === e) return this.map[t].cell;
        return null;
      }),
      (r.prototype.removeCrosswordCells = function (e) {
        for (let t = 0; t < this.map.length; t++)
          this.map[t].cell.crossword === e && this.map.splice(t, 1);
      }),
      (e.exports = r);
  },
  function (e, t) {
    e.exports = {
      removeClass: function (e, t) {
        const r = new RegExp(`(?:^|\\s)${t}(?!\\S)`, 'g');
        e.className = e.className.replace(r, '');
      },
      addClass: function (e, t) {
        e.className += ' ' + t;
      },
    };
  },
  function (e, t, r) {},
]);
