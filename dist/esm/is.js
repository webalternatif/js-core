function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import { inArray } from "./array.js";
export var isString = function isString(str) {
  return typeof str == 'string' || Object.prototype.toString.call(str) === '[object String]';
};
export var isObject = function isObject(o) {
  return !!o && !isArray(o) && _typeof(o) === 'object';
};
export var isFunction = function isFunction(f) {
  return !!f && typeof f === 'function';
};
export var isPlainObject = function isPlainObject(o) {
  if (false === isObject(o)) return false;
  if (undefined === o.constructor) return true;
  if (false === isObject(o.constructor.prototype)) return false;
  if (o.constructor.prototype.hasOwnProperty('isPrototypeOf') === false) return false;
  return true;
};
export var isBoolean = function isBoolean(b) {
  return b === true || b === false;
};
export var isBool = isBoolean;
export var isUndefined = function isUndefined(v) {
  return typeof v === 'undefined';
};
export var isArrayLike = function isArrayLike(o) {
  return null !== o && !isString(o) && !isFunction(o) && isInt(o.length) && o.length >= 0 && Number.isFinite(o.length);
};
export var isArray = function isArray(a) {
  return Array.isArray(a);
};
export var isDate = function isDate(o) {
  return !!o && Object.prototype.toString.call(o) === '[object Date]';
};
export var isEvent = function isEvent(o) {
  return isObject(o) && (!!o.preventDefault || /\[object Event\]/.test(o.constructor.toString()));
};
export var isInteger = function isInteger(n) {
  return /^[\-]?\d+$/.test(n + '');
};
export var isInt = isInteger;
export var isFloat = function isFloat(n) {
  return /^[\-]?\d+(\.\d+)?$/.test(n + '');
};
export var isScalar = function isScalar(value) {
  var type = _typeof(value);
  return value === null || inArray(type, ['string', 'number', 'bigint', 'symbol', 'boolean']);
};
export var isEventSupported = function () {
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
export var isTouchDevice = function isTouchDevice() {
  return isEventSupported('touchstart');
};