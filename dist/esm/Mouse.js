function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
import webf from '@webalternatif/js-core';
var Mouse = /*#__PURE__*/function () {
  function Mouse() {
    _classCallCheck(this, Mouse);
  }
  return _createClass(Mouse, null, [{
    key: "getPosition",
    value:
    /**
     * @param {Event} ev
     * @param {Element} element
     * @returns {{x: number, y: number}}
     */
    function getPosition(ev, element) {
      ev = _assertClassBrand(Mouse, this, _getEvent).call(this, ev);
      var rect = {
        left: 0,
        top: 0
      };
      if (element instanceof Element) {
        var r = element.getBoundingClientRect();
        rect = {
          left: window.scrollX + r.left,
          top: window.scrollY + r.top
        };
      }
      return {
        x: ev.pageX - rect.left,
        y: ev.pageY - rect.top
      };
    }

    /**
     * @param {Event} ev
     * @returns {{x: number, y: number}}
     */
  }, {
    key: "getViewportPosition",
    value: function getViewportPosition(ev) {
      ev = _assertClassBrand(Mouse, this, _getEvent).call(this, ev);
      return {
        x: ev.clientX,
        y: ev.clientY
      };
    }
  }, {
    key: "getElement",
    value: function getElement(ev) {
      ev = _assertClassBrand(Mouse, this, _getEvent).call(this, ev);
      return window.document.elementFromPoint(ev.clientX, ev.clientY);
    }

    /**
     * Normalize an event
     *
     * @param {Event|{originalEvent?: Event}|{detail?: {originalEvent?: Event}}} ev
     * @returns {{clientX:number, clientY:number, pageX:number, pageY:number}|null}
     */
  }]);
}();
function _getEvent(ev) {
  var _ref, _ev$detail$originalEv, _ev$detail, _ref2, _e$changedTouches$, _e$changedTouches, _e$touches;
  var e = (_ref = (_ev$detail$originalEv = ev === null || ev === void 0 || (_ev$detail = ev.detail) === null || _ev$detail === void 0 ? void 0 : _ev$detail.originalEvent) !== null && _ev$detail$originalEv !== void 0 ? _ev$detail$originalEv : ev === null || ev === void 0 ? void 0 : ev.originalEvent) !== null && _ref !== void 0 ? _ref : ev;
  if (!e) return null;
  var src = (_ref2 = (_e$changedTouches$ = (_e$changedTouches = e.changedTouches) === null || _e$changedTouches === void 0 ? void 0 : _e$changedTouches[0]) !== null && _e$changedTouches$ !== void 0 ? _e$changedTouches$ : (_e$touches = e.touches) === null || _e$touches === void 0 ? void 0 : _e$touches[0]) !== null && _ref2 !== void 0 ? _ref2 : e;
  var clientX = typeof src.clientX === 'number' ? src.clientX : 0;
  var clientY = typeof src.clientY === 'number' ? src.clientY : 0;
  var pageX = typeof src.pageX === 'number' ? src.pageX : clientX + ('undefined' !== typeof window ? window.scrollX : 0);
  var pageY = typeof src.pageY === 'number' ? src.pageY : clientY + ('undefined' !== typeof window ? window.scrollY : 0);
  return {
    clientX: clientX,
    clientY: clientY,
    pageX: pageX,
    pageY: pageY
  };
}
export default Mouse;

/* istanbul ignore else */
if (typeof window !== 'undefined') {
  window.webf = window.webf || {};
  window.webf.mouse = Mouse;
}