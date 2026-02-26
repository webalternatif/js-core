"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.round = exports.plancher = exports.min = exports.max = exports.hex2dec = exports.floorTo = exports.dec2hex = void 0;
var _traversal = require("./traversal.js");
var _is = require("./is.js");
var _string = require("./string.js");
/**
 * @typedef {import('./traversal.js').Collection} Collection
 */

/**
 * Rounds to the nearest multiple of the precision
 *
 * @param {number} val
 * @param {number} [precision=0]
 * @returns {number} - The rounded value
 */
var round = exports.round = function round(val) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision);
};

/**
 * Rounds down to the nearest multiple of the precision
 *
 * @param {number} val
 * @param {number} precision
 * @returns {number} - The rounded value
 */
var floorTo = exports.floorTo = function floorTo(val, precision) {
  if (precision <= 0) throw new Error('Precision must be greater than 0');
  return round(Math.floor(val / precision) * precision, 6);
};
var plancher = exports.plancher = floorTo;

/**
 * @template T
 * @param {Iterable<T>|Record<string, T>} list
 * @param {(a: T, b: T) => number} [cmp_func]
 * @returns {T|undefined}
 */
var min = exports.min = function min(list, cmp_func) {
  cmp_func = (0, _is.isFunction)(cmp_func) ? cmp_func : function (a, b) {
    return a < b ? -1 : 1;
  };
  return compare(list, cmp_func);
};

/**
 * @template T
 * @param {Collection<T>} list
 * @param {(a: T, b: T) => number} [cmp_func]
 * @returns {T|undefined}
 */
var max = exports.max = function max(list, cmp_func) {
  cmp_func = (0, _is.isFunction)(cmp_func) ? cmp_func : function (a, b) {
    return a > b ? -1 : 1;
  };
  return compare(list, cmp_func);
};

/**
 * @template T
 * @param {Collection<T>} list
 * @param {(a: T, b: T) => number} [cmp_func]
 * @returns {T|undefined}
 */
function compare(list, cmp_func) {
  var result;
  (0, _traversal.each)(list, function (key, val, obj, index) {
    if (index === 0) {
      result = val;
    } else {
      result = cmp_func.call(null, result, val) > 0 ? val : result;
    }
  });
  return result;
}

/**
 * Converts a decimal number into hexadecimal
 *
 * @param {number} n
 * @returns {string}
 */
var dec2hex = exports.dec2hex = function dec2hex(n) {
  return n.toString(16);
};

/**
 * Converts a hexadecimal into a decimal number
 *
 * @param {string} hex
 * @returns {number}
 */
var hex2dec = exports.hex2dec = function hex2dec(hex) {
  hex = (0, _string.reverse)(hex + '').toUpperCase();
  var c = '0123456789ABCDEF';
  var value = 0;
  (0, _traversal.each)(hex, function (i, _char) {
    var index = c.indexOf(_char);
    if (index === -1) {
      value = 0;
      return false;
    }
    value += index * Math.pow(2, 4 * i);
  });
  return value;
};