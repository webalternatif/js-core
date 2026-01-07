import { each } from "./traversal.js";
import { isArray, isFunction, isObject } from "./is.js";
import { reverse } from "./string.js";
export var round = function round(val) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision);
};
export var floorTo = function floorTo(n, precision) {
  if (precision <= 0) throw new Error('Precision must be greater than 0');
  return round(Math.floor(n / precision) * precision, 6);
};
export var plancher = floorTo;
export var min = function min(list, cmp_func) {
  if (isArray(list)) {
    return Math.min.apply(null, list);
  }
  var min;
  cmp_func = isFunction(cmp_func) ? cmp_func : function (a, b) {
    return a < b ? -1 : 1;
  };
  if (isObject(list)) {
    each(list, function (key, val, obj, index) {
      if (index === 0) {
        min = val;
      } else {
        min = cmp_func.call(null, min, val) > 0 ? val : min;
      }
    });
  }
  return min;
};
export var max = function max(list, cmp_func) {
  if (isArray(list)) {
    return Math.max.apply(null, list);
  }
  var max;
  cmp_func = isFunction(cmp_func) ? cmp_func : function (a, b) {
    return b - a;
  };
  if (isObject(list)) {
    each(list, function (key, val, obj, index) {
      if (index === 0) {
        max = val;
      } else {
        max = cmp_func.call(null, max, val) > 0 ? val : max;
      }
    });
  }
  return max;
};

/**
 * Converts a decimal number into hexadecimal
 *
 * @param {number} n
 * @returns {string}
 */
export var dec2hex = function dec2hex(n) {
  return n.toString(16);
};

/**
 * Converts a hexadecimal into a decimal number
 *
 * @param {string} hex
 * @returns {number}
 */
export var hex2dec = function hex2dec(hex) {
  hex = reverse(hex + '').toUpperCase();
  var c = '0123456789ABCDEF';
  var value = 0;
  each(hex, function (i, _char) {
    var index = c.indexOf(_char);
    if (index === -1) {
      value = 0;
      return false;
    }
    value += index * Math.pow(2, 4 * i);
  });
  return value;
};