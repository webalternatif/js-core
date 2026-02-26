"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWindow = exports.isUndefined = exports.isTouchDevice = exports.isString = exports.isScalar = exports.isPlainObject = exports.isObject = exports.isInteger = exports.isInt = exports.isFunction = exports.isFloat = exports.isEventSupported = exports.isEvent = exports.isDomElement = exports.isDocument = exports.isDate = exports.isBoolean = exports.isBool = exports.isArrayLike = exports.isArray = void 0;
var _array = require("./array.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * @param {any} str
 * @returns {boolean}
 */
var isString = exports.isString = function isString(str) {
  return typeof str === 'string' || Object.prototype.toString.call(str) === '[object String]';
};

/**
 * @param {any} o
 * @returns {boolean}
 */
var isObject = exports.isObject = function isObject(o) {
  return !!o && !isArray(o) && _typeof(o) === 'object';
};

/**
 * @param {any} f
 * @returns {boolean}
 */
var isFunction = exports.isFunction = function isFunction(f) {
  return !!f && typeof f === 'function';
};

/**
 * @param {any} o
 * @returns {boolean}
 */
var isPlainObject = exports.isPlainObject = function isPlainObject(o) {
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
var isBoolean = exports.isBoolean = function isBoolean(b) {
  return b === true || b === false;
};
var isBool = exports.isBool = isBoolean;

/**
 * @param {any} v
 * @returns {boolean}
 */
var isUndefined = exports.isUndefined = function isUndefined(v) {
  return typeof v === 'undefined';
};

/**
 * @param {any} o
 * @returns {boolean}
 */
var isArrayLike = exports.isArrayLike = function isArrayLike(o) {
  return !!o && !isString(o) && !isFunction(o) && isInt(o.length) &&
  // && o.length >= 0
  Number.isFinite(o.length);
};

/**
 * @param {any} a
 * @returns {boolean}
 */
var isArray = exports.isArray = function isArray(a) {
  return Array.isArray(a);
};

/**
 * @param {any} o
 * @returns {boolean}
 */
var isDate = exports.isDate = function isDate(o) {
  return !!o && Object.prototype.toString.call(o) === '[object Date]';
};

/**
 * @param {any} o
 * @returns {boolean}
 */
var isEvent = exports.isEvent = function isEvent(o) {
  return isObject(o) && (!!o.preventDefault || /\[object Event\]/.test(o.constructor.toString()));
};

/**
 * @param {any} n
 * @returns {boolean}
 */
var isInteger = exports.isInteger = function isInteger(n) {
  return /^[-+]?\d+$/.test(n + '');
};
var isInt = exports.isInt = isInteger;

/**
 * @param {any} n
 * @returns {boolean}
 */
var isFloat = exports.isFloat = function isFloat(n) {
  return /^[-+]?\d+(\.\d+)?$/.test(n + '');
};

/**
 * @param {any} v
 * @returns {boolean}
 */
var isScalar = exports.isScalar = function isScalar(v) {
  var type = _typeof(v);
  return null === v || (0, _array.inArray)(type, ['string', 'number', 'bigint', 'symbol', 'boolean']);
};

/**
 * @param {string} eventName
 * @returns {boolean}
 */
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

/**
 * @returns {boolean}
 */
var isTouchDevice = exports.isTouchDevice = function isTouchDevice() {
  return isEventSupported('touchstart');
};

/**
 * Checks whether the given value is the global `window` object.
 *
 * @example
 * isWindow(window) // true
 * isWindow(globalThis) // true (in browsers)
 *
 * @param {any} o - Value to test
 * @returns {boolean} - `true` if the value is the browser window object
 */
var isWindow = exports.isWindow = function isWindow(o) {
  return !!o && o === o.window;
};

/**
 * Checks whether the given value is the global `document` object.
 *
 * @example
 * isDocument(document) // true (in browsers)
 * isDocument(window.document) // true (in browsers)
 * isDocument({document}) // false
 *
 * @param {any} o - Value to test
 * @returns {boolean} - `true` if the value is the browser document object
 */
var isDocument = exports.isDocument = function isDocument(o) {
  return !!o && o.nodeType === 9;
};

/**
 * Checks whether the given value is a DOM Element.
 *
 * @example
 * const el = document.createElement('div')
 * isDomElement(el) // true
 *
 * @param {any} o - Value to test
 * @returns {boolean} - `true` if the value is a DOM Element
 */
var isDomElement = exports.isDomElement = function isDomElement(o) {
  return isObject(o) && 1 === o.nodeType && !isPlainObject(o);
};