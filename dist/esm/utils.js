function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import { map } from './traversal.js';
import { isArray, isObject } from './is.js';
import { indexOf } from './array.js';

/**
 * Deeply compares two or more values for structural equality.
 *
 * All provided values must be deeply equal for the function to return `true`.
 * Comparison is recursive and handles objects, arrays, and built-in types.
 *
 * @example
 * equals(1, 1) // => true
 * equals(NaN, NaN) // => true
 * equals([1, { a: 2 }], [1, { a: 2 }]) // => true
 * equals({ a: 1 }, { a: 1, b: 2 }) // => false
 * equals(
 *   { a: { b: 1 } },
 *   { a: { b: 1 } },
 *   { a: { b: 1 } },
 * ) // => true
 *
 * const a = {}; a.self = a
 * const b = {}; b.self = b
 * equals(a, b) // => true
 *
 * equals(new Date(1000), new Date(1000)) // => true
 * equals(new Date(1000), new Date(2000)) // => false
 *
 * equals(/abc/gi, /abc/gi) // => true
 * equals(/abc/g, /abc/i)   // => false
 *
 * @param {...any} values - Two or more values to compare.
 * @returns {boolean} `true` if all values are deeply equal, otherwise `false`.
 */
export var equals = function equals() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }
  if (values.length < 2) return false;
  var _compare = function compare(o1, o2) {
    var seen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new WeakMap();
    if (o1 === o2) return true;
    if (Number.isNaN(o1) && Number.isNaN(o2)) return true;
    if (_typeof(o1) !== _typeof(o2) || null === o1 || null === o2) return false;
    if (isArray(o1) || isObject(o1)) {
      if (seen.has(o1)) return seen.get(o1) === o2;
      seen.set(o1, o2);
    }
    if (isArray(o1) || isArray(o2)) {
      if (!isArray(o1) || !isArray(o2)) return false;
      if (o1.length !== o2.length) return false;
      return o1.every(function (v, i) {
        return _compare(v, o2[i], seen);
      });
    }
    if (isObject(o1)) {
      if (Object.getPrototypeOf(o1) !== Object.getPrototypeOf(o2)) return false;
      if (o1 instanceof Date) return o1.getTime() === o2.getTime();
      if (o1 instanceof RegExp) return o1.toString() === o2.toString();
      var keys1 = Object.keys(o1),
        keys2 = Object.keys(o2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every(function (key) {
        return _compare(o1[key], o2[key], seen);
      });
    }
    return false;
  };
  var first = values[0];
  return values.slice(1).every(function (v) {
    return _compare(first, v);
  });
};

/**
 * No-operation function. Useful as a default callback or placeholder.
 *
 * @returns {void}
 */
export var noop = function noop() {};

/**
 * Returns the size of a collection. Can be an object, an array or string.
 *
 * @example
 * sizeOf([1, 2, 3])        // => 3
 * sizeOf("hello")          // => 5
 * sizeOf({ a: 1, b: 2 })   // => 2
 *
 * @param {Object|Array|string} v - The value to count
 * @returns {number} - The size of `v`
 */
export var sizeOf = function sizeOf(v) {
  return map(v, noop).length;
};

/**
 * Recursively flattens values of an object or array into a single-level array.
 *
 * @example <caption>Flatten an array of arrays</caption>
 * const result = flatten([1, [2, [3, 4]], 5])
 * // Output: [1, 2, 3, 4, 5]
 *
 * @example <caption>Flatten an object</caption>
 * const result = flatten({ a: 1, b: [2, { c: 3 }], d: 4 });
 * // Output: [1, 2, 3, 4]
 *
 * @param {Object|Array} o - The object or array to flatten.
 * @returns {Array} A flattened array containing all the values from the input object or array.
 */
var _flatten = function flatten(o) {
  if (isObject(o) || isArray(o)) {
    return [].concat.apply([], map(o, function (_, val) {
      return _flatten(val);
    }));
  }
  return o;
};

/**
 * Parses a number from a string.
 *
 * @example
 * strParseFloat("12.34")      // => 12.34
 * strParseFloat("12,34")      // => 12.34
 * strParseFloat(" 1 234,56 ") // => 1234.56
 *
 * @param val
 * @returns {number}
 */
export { _flatten as flatten };
export var strParseFloat = function strParseFloat(val) {
  if (!val) return 0;
  var result = parseFloat((val + '').replace(/\s/g, '').replace(',', '.'));
  return Number.isNaN(result) ? 0 : result;
};

/**
 * Creates a throttled version of a function that only executes at most once
 * every `wait` milliseconds.
 *
 * @example
 * const throttled = throttle(() => console.log('tick'), 1000)
 * window.addEventListener('scroll', throttled)
 *
 * @example
 * // runs at the end
 * const throttled = throttle(doSomething, 500, false, true)
 *
 * @example
 * // runs immediately
 * const throttled = throttle(doSomething, 500, true, false)
 *
 * @param {Function} func - The function to throttle.
 * @param {number} wait - The number of milliseconds before execution of `func`.
 * @param {boolean} [leading=true] - if `true` run `func` a first time immediately.
 * @param {boolean} [trailing=true] - if `true` run `func` one last time after timeout.
 * @param {any} [context=null] - Optional `this` context to bind when invoking `func`.
 * @returns {Function} - A throotled function
 */
export var throttle = function throttle(func, wait) {
  var leading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var trailing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var context = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var timeout = null;
  var lastCall = 0;
  return function () {
    var _this = this;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    var now = Date.now();
    if (!lastCall && !leading) lastCall = now;
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
 * @example
 * // Search input: only trigger search after user stops typing
 * const debouncedSearch = debounce(query => {
 *   api.search(query)
 * }, 300)
 *
 * input.addEventListener('input', ev => {
 *   debouncedSearch(ev.target.value)
 * })
 *
 * @example
 * // Resize handler : run layout update only after resizing stops
 * const debouncedResize = debounce(() => {
 *   updateLayout()
 * }, 500)
 *
 * window.addEventListener('resize', debouncedResize)
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @param {boolean} [immediate=false] - If true, execute `func` on the leading edge instead of the trailing.
 * @param {any} [context=null] - The context to bind to `func`.
 * @returns {Function} - The debounced function.
 */
export var debounce = function debounce(func, wait) {
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var timeout = null;
  var lastCall = 0;
  return function () {
    var _this2 = this;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
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