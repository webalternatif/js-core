"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttle = exports.strParseFloat = exports.sizeOf = exports.noop = exports.flatten = exports.equals = exports.debounce = void 0;
var _traversal = require("./traversal.js");
var _is = require("./is.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _equals = exports.equals = function equals(o1, o2) {
  var seen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new WeakMap();
  if (o1 === o2) return true;
  if (_typeof(o1) !== _typeof(o2) || o1 == null || o2 == null) {
    return false;
  }
  if ((0, _is.isObject)(o1)) {
    if (seen.has(o1)) {
      return seen.get(o1) === o2;
    }
    seen.set(o1, o2);
    var keys1 = Object.keys(o1),
      keys2 = Object.keys(o2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    return keys1.every(function (key) {
      return _equals(o1[key], o2[key], seen);
    });
  }
  return false;
};
var noop = exports.noop = function noop() {};
var sizeOf = exports.sizeOf = function sizeOf(o) {
  return (0, _traversal.map)(o, noop).length;
};

/**
 * Recursively flattens an object or array into a single-level array.
 *
 * @param {Object|Array} o - The object or array to flatten.
 * @returns {Array} A flattened array containing all the values from the input object or array.
 *
 * @example <caption>Flatten an array of arrays</caption>
 * const result = flatten([1, [2, [3, 4]], 5]);
 * console.log(result);
 * // Output: [1, 2, 3, 4, 5]
 *
 * @example <caption>Flatten an object</caption>
 * const result = flatten({ a: 1, b: [2, { c: 3 }], d: 4 });
 * console.log(result);
 * // Output: [1, 2, 3, 4]
 */
var _flatten = exports.flatten = function flatten(o) {
  if ((0, _is.isObject)(o) || (0, _is.isArray)(o)) {
    return [].concat.apply([], (0, _traversal.map)(o, function (i, val) {
      return _flatten(val);
    }));
  }
  return o;
};
var strParseFloat = exports.strParseFloat = function strParseFloat(val) {
  if (!val) return 0;
  return parseFloat((val + '').replace(/\s/g, '').replace(',', '.'));
};
var throttle = exports.throttle = function throttle(func, wait) {
  var leading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var trailing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var context = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var timeout = null;
  var lastCall = 0;
  return function () {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var now = Date.now();
    if (!lastCall && !leading) {
      lastCall = now;
    }
    var remaining = wait - (now - lastCall);
    if (remaining <= 0 || remaining > wait) {
      lastCall = now;
      func.apply(context || this, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(function () {
        timeout = null;
        lastCall = leading ? Date.now() : 0;
        func.apply(context || _this, args);
      }, remaining);
    }
  };
};

/**
 * Creates a debounced function that delays the invocation of `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @param {boolean} [immediate=false] - If true, execute `func` on the leading edge instead of the trailing.
 * @param {Object} [context=null] - The context to bind to `func`.
 * @returns {Function} The debounced function.
 */
var debounce = exports.debounce = function debounce(func, wait) {
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var timeout = null;
  var lastCall = 0;
  return function () {
    var _this2 = this;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    var now = Date.now();
    if (immediate) {
      if (!lastCall) {
        lastCall = now;
        func.apply(context || this, args);
      }
    }
    clearTimeout(timeout);
    timeout = null;
    timeout = setTimeout(function () {
      lastCall = now;
      clearTimeout(timeout);
      timeout = null;
      func.apply(context || _this2, args);
    }, wait);
  };
};