import { each } from "./traversal.js";
import { isArray, isInteger, isObject, isString, isUndefined } from "./is.js";
import { round } from "./math.js";
import { equals } from "./utils.js";

/**
 * Checks if a value exists in an array or an object
 *
 * @param {*} value the searched value
 * @param {Object|Array} arr the array
 * @param {number} [index=0] if provided, search from this index
 * @param {boolean} [strict=false] if true, search is done with strict equality
 * @returns {boolean}
 *
 * @example
 * inArray(2, [1, 2, 3])
 * // → true
 *
 * @example
 * inArray({a: 1}, {a: 1, b: 2})
 * // → true
 *
 * @example
 * inArray(5, [1, 2, 3])
 * // → false
 */
export var inArray = function inArray(value, arr) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var strict = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var ret = false;
  each(arr, function (i, val) {
    if (i >= index) {
      if (strict) {
        if (val === value) {
          ret = true;
          return false;
        }
      } else {
        if (isObject(value) && isObject(val)) {
          ret = equals(val, value);
          return false;
        } else if (isArray(value) && isObject(val)) {
          ret = _compareArray(val, value);
          return false;
        } else if (val == value) {
          ret = true;
          return false;
        }
      }
    }
  });
  return ret;
};
export var indexOf = function indexOf(arr, elt) {
  var from = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  from = from < 0 ? Math.ceil(from) + arr.length : Math.floor(from);
  for (; from < arr.length; from++) {
    if (from in arr && arr[from] === elt) {
      return from;
    }
  }
  return -1;
};
var _compareArray = function compareArray(a1, a2) {
  if (a1.length !== a2.length) {
    return false;
  } else {
    for (var i = 0; i < a1.length; i++) {
      if (isArray(a1[i])) {
        if (!isArray(a2[i])) {
          return false;
        }
        return _compareArray(a1[i], a2[i]);
      } else if (a1[i] !== a2[i]) {
        return false;
      }
    }
  }
  return true;
};
export { _compareArray as compareArray };
export var arrayUnique = function arrayUnique(arr) {
  return arr.filter(function (el, index, arr) {
    return index === indexOf(arr, el);
  });
};
export var array_unique = arrayUnique;
export var arrayDiff = function arrayDiff(array1, array2) {
  var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return array1.filter(function (item) {
    return !inArray(item, array2, 0, strict);
  });
};
export var array_diff = arrayUnique;
export var range = function range(size) {
  var startAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  size = round(size);
  step = round(step);
  var rng = [];
  if (isUndefined(startAt) || size < 1 || step === 0 || size < Math.abs(step)) {
    return rng;
  }
  var end = size * step;
  if (isString(startAt)) {
    startAt = startAt.charCodeAt(0);
    for (var i = 0; step > 0 ? i < end : i > end; i += step) {
      rng.push(String.fromCharCode(startAt + i));
    }
  } else if (isInteger(startAt)) {
    for (var _i = 0; step > 0 ? _i < end : _i > end; _i += step) {
      rng.push(startAt + _i);
    }
  }
  return rng;
};