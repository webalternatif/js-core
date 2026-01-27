"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _is = require("./is.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
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
     * @param {Event|{originalEvent?: Event}} ev
     * @returns {Event}
     */
  }]);
}();
function _getEvent(ev) {
  var _ev$originalEvent;
  ev = (_ev$originalEvent = ev.originalEvent) !== null && _ev$originalEvent !== void 0 ? _ev$originalEvent : ev;
  if ((0, _is.isTouchDevice)()) {
    var _ev$changedTouches, _ev$touches;
    var touch = ((_ev$changedTouches = ev.changedTouches) === null || _ev$changedTouches === void 0 ? void 0 : _ev$changedTouches[0]) || ((_ev$touches = ev.touches) === null || _ev$touches === void 0 ? void 0 : _ev$touches[0]);
    ev.clientX = touch.clientX;
    ev.clientY = touch.clientY;
    ev.pageX = touch.pageX;
    ev.pageY = touch.pageY;
  }
  return ev;
}
var _default = exports["default"] = Mouse;