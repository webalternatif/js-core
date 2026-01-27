function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import { inArray } from "./array.js";

/**
 * @param {any} str
 * @returns {boolean}
 */
export var isString = function isString(str) {
  return typeof str == 'string' || Object.prototype.toString.call(str) === '[object String]';
};

/**
 * @param {any} o
 * @returns {boolean}
 */
export var isObject = function isObject(o) {
  return !!o && !isArray(o) && _typeof(o) === 'object';
};

/**
 * @param {any} f
 * @returns {boolean}
 */
export var isFunction = function isFunction(f) {
  return !!f && typeof f === 'function';
};

/**
 * @param {any} o
 * @returns {boolean}
 */
export var isPlainObject = function isPlainObject(o) {
  if (false === isObject(o)) return false;
  if (undefined === o.constructor) return true;
  if (false === isObject(o.constructor.prototype)) return false;
  if (o.constructor.prototype.hasOwnProperty('isPrototypeOf') === false) return false;
  return true;
};

/**
 * @param {any} b
 * @returns {boolean}
 */
export var isBoolean = function isBoolean(b) {
  return b === true || b === false;
};
export var isBool = isBoolean;

/**
 * @param {any} v
 * @returns {boolean}
 */
export var isUndefined = function isUndefined(v) {
  return typeof v === 'undefined';
};

/**
 * @param {any} o
 * @returns {boolean}
 */
export var isArrayLike = function isArrayLike(o) {
  return !!o && !isString(o) && !isFunction(o) && isInt(o.length)
  // && o.length >= 0
  && Number.isFinite(o.length);
};

/**
 * @param {any} a
 * @returns {boolean}
 */
export var isArray = function isArray(a) {
  return Array.isArray(a);
};

/**
 * @param {any} o
 * @returns {boolean}
 */
export var isDate = function isDate(o) {
  return !!o && Object.prototype.toString.call(o) === '[object Date]';
};

/**
 * @param {any} o
 * @returns {boolean}
 */
export var isEvent = function isEvent(o) {
  return isObject(o) && (!!o.preventDefault || /\[object Event\]/.test(o.constructor.toString()));
};

/**
 * @param {any} n
 * @returns {boolean}
 */
export var isInteger = function isInteger(n) {
  return /^[\-+]?\d+$/.test(n + '');
};
export var isInt = isInteger;

/**
 * @param {any} n
 * @returns {boolean}
 */
export var isFloat = function isFloat(n) {
  return /^[\-+]?\d+(\.\d+)?$/.test(n + '');
};

/**
 * @param {any} v
 * @returns {boolean}
 */
export var isScalar = function isScalar(v) {
  var type = _typeof(v);
  return null === v || inArray(type, ['string', 'number', 'bigint', 'symbol', 'boolean']);
};

/**
 * @param {string} eventName
 * @returns {boolean}
 */
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

/**
 * @returns {boolean}
 */
export var isTouchDevice = function isTouchDevice() {
  return isEventSupported('touchstart');
};