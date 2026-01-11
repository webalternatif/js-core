"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Mouse", {
  enumerable: true,
  get: function get() {
    return _Mouse["default"];
  }
});
Object.defineProperty(exports, "Translator", {
  enumerable: true,
  get: function get() {
    return _Translator["default"];
  }
});
exports["default"] = exports.arrayFunctions = void 0;
Object.defineProperty(exports, "dom", {
  enumerable: true,
  get: function get() {
    return _dom["default"];
  }
});
Object.defineProperty(exports, "eventDispatcher", {
  enumerable: true,
  get: function get() {
    return _eventDispatcher["default"];
  }
});
Object.defineProperty(exports, "getStyle", {
  enumerable: true,
  get: function get() {
    return _dom.getStyle;
  }
});
exports.utils = exports.traversal = exports.stringFunctions = exports.random = exports.math = exports.is = void 0;
var stringFunctions = _interopRequireWildcard(require("./string.js"));
exports.stringFunctions = stringFunctions;
require("./stringPrototype.js");
var arrayFunctions = _interopRequireWildcard(require("./array.js"));
exports.arrayFunctions = arrayFunctions;
var is = _interopRequireWildcard(require("./is.js"));
exports.is = is;
var random = _interopRequireWildcard(require("./random.js"));
exports.random = random;
var traversal = _interopRequireWildcard(require("./traversal.js"));
exports.traversal = traversal;
var _dom = _interopRequireWildcard(require("./dom.js"));
var math = _interopRequireWildcard(require("./math.js"));
exports.math = math;
var utils = _interopRequireWildcard(require("./utils.js"));
exports.utils = utils;
var _Translator = _interopRequireWildcard(require("./Translator.js"));
var i18n = _Translator;
var _eventDispatcher = _interopRequireDefault(require("./eventDispatcher.js"));
var _Mouse = _interopRequireDefault(require("./Mouse.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var webf = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, stringFunctions), arrayFunctions), traversal), is), random), {}, {
  dom: _dom["default"],
  isWindow: _dom.isWindow,
  isDocument: _dom.isDocument,
  isDomElement: _dom.isDomElement,
  getStyle: _dom.getStyle
}, math), utils), i18n);
var _default = exports["default"] = webf;