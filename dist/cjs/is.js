"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUndefined = exports.isTouchDevice = exports.isString = exports.isScalar = exports.isPlainObject = exports.isObject = exports.isInteger = exports.isInt = exports.isFunction = exports.isFloat = exports.isEventSupported = exports.isEvent = exports.isDate = exports.isBoolean = exports.isBool = exports.isArrayLike = exports.isArray = void 0;
var _array = require("./array.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var isString = exports.isString = function isString(str) {
  return typeof str == 'string' || Object.prototype.toString.call(str) === '[object String]';
};
var isObject = exports.isObject = function isObject(o) {
  return !!o && !isArray(o) && _typeof(o) === 'object';
};
var isFunction = exports.isFunction = function isFunction(f) {
  return !!f && typeof f === 'function';
};
var isPlainObject = exports.isPlainObject = function isPlainObject(o) {
  if (false === isObject(o)) return false;
  if (undefined === o.constructor) return true;
  if (false === isObject(o.constructor.prototype)) return false;
  if (o.constructor.prototype.hasOwnProperty('isPrototypeOf') === false) return false;
  return true;
};
var isBoolean = exports.isBoolean = function isBoolean(b) {
  return b === true || b === false;
};
var isBool = exports.isBool = isBoolean;
var isUndefined = exports.isUndefined = function isUndefined(v) {
  return typeof v === 'undefined';
};
var isArrayLike = exports.isArrayLike = function isArrayLike(o) {
  return !!o && !isString(o) && !isFunction(o) && isInt(o.length)
  // && o.length >= 0
  && Number.isFinite(o.length);
};
var isArray = exports.isArray = function isArray(a) {
  return Array.isArray(a);
};
var isDate = exports.isDate = function isDate(o) {
  return !!o && Object.prototype.toString.call(o) === '[object Date]';
};
var isEvent = exports.isEvent = function isEvent(o) {
  return isObject(o) && (!!o.preventDefault || /\[object Event\]/.test(o.constructor.toString()));
};
var isInteger = exports.isInteger = function isInteger(n) {
  return /^[\-]?\d+$/.test(n + '');
};
var isInt = exports.isInt = isInteger;
var isFloat = exports.isFloat = function isFloat(n) {
  return /^[\-]?\d+(\.\d+)?$/.test(n + '');
};
var isScalar = exports.isScalar = function isScalar(value) {
  var type = _typeof(value);
  return value === null || (0, _array.inArray)(type, ['string', 'number', 'bigint', 'symbol', 'boolean']);
};
var isEventSupported = exports.isEventSupported = function () {
  var TAGNAMES = {
    select: 'input',
    change: 'input',
    submit: 'form',
    reset: 'form',
    error: 'img',
    load: 'img',
    abort: 'img'
  };
  function isEventSupported(eventName) {
    var el = document.createElement(TAGNAMES[eventName] || 'div');
    eventName = 'on' + eventName;
    var isSupported = eventName in el;
    el = null;
    return isSupported;
  }
  return isEventSupported;
}();
var isTouchDevice = exports.isTouchDevice = function isTouchDevice() {
  return isEventSupported('touchstart');
};