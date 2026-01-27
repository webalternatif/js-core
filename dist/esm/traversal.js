function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import { isArray, isArrayLike, isBoolean, isObject, isPlainObject, isString, isUndefined } from './is.js';
import { isWindow } from './dom.js';
import { sizeOf } from './utils.js';

/**
 * @template T
 * @typedef {Array<T> | Set<T> | Map<any, T> | Object<string, T> | string | string[]} Collection
 */

/**
 * Iterates over Arrays, Strings, Maps, Sets and plain Objects.
 *
 * The callback receives:
 *   (keyOrIndex, value, o, index)
 *
 * If the callback returns `false`, the iteration stops.
 *
 * @template T
 * @param {Collection<T>} o
 * @param {(key: number|string, value: T, o: Collection<T>, index: number) => (void|boolean)} callback
 * @param {any} [context] Optional "this" binding for the callback
 * @returns {typeof o} Returns the original input
 */
export var each = function each(o, callback, context) {
  if (isPlainObject(o)) {
    var index = -1;
    for (var i in o) if (o.hasOwnProperty(i) && false === callback.call(context !== null && context !== void 0 ? context : o[i], i, o[i], o, ++index)) return;
  } else if (isString(o)) {
    var arr = o.split('');
    for (var _i = 0; _i < arr.length; _i++) if (false === callback.call(context !== null && context !== void 0 ? context : arr[_i], _i, arr[_i], o, _i)) return o;
    return o;
  } else if (o instanceof Map) {
    var _index = 0;
    var _iterator = _createForOfIteratorHelper(o.entries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];
        if (false === callback.call(context !== null && context !== void 0 ? context : value, key, value, o, _index++)) return o;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else if (o instanceof Set) {
    var _index2 = 0;
    var _iterator2 = _createForOfIteratorHelper(o.values()),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _value = _step2.value;
        if (false === callback.call(context !== null && context !== void 0 ? context : _value, _index2, _value, o, _index2)) return o;
        _index2++;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  } else if (isArrayLike(o)) {
    var _arr = Array.from(o);
    for (var _i2 = 0; _i2 < _arr.length; _i2++) if (false === callback.call(context || _arr[_i2], _i2, _arr[_i2], _arr, _i2)) return o;
  }
  return o;
};

/**
 * Same as each except that key and value are reversed in callback
 *
 * The callback receives:
 *   (value, keyOrIndex, o, index)
 *
 * @template T
 * @param {Collection<T>} o
 * @param {(value: T, key: number|string, o: Collection<T>, index: number) => (void|boolean)} callback
 * @param {any} [context] Optional "this" binding for the callback
 * @returns {typeof o} Returns the original input
 */
export var foreach = function foreach(o, callback, context) {
  return each(o, function (key, value, o, index) {
    return callback.apply(context || value, [value, key, o, index]);
  }, context);
};

/**
 * Iterates over Arrays, Strings, Maps, Sets and plain Objects.
 * Returns an array from the callback results.
 * Values strictly equal to `null` are skipped.
 * Values strictly equal to `false` stops the iteration.
 *
 * The callback receives:
 *   (keyOrIndex, value, o, index)
 *
 * @template T,R
 * @param {Collection<T>} o
 * @param {(key: number|string, value: T, o: Collection<T>, index: number) => (R|null|false)} callback
 * @param {any} [context] Optional "this" binding for the callback
 * @returns {Array<R>} Returns the resulted array
 */
export var map = function map(o, callback, context) {
  var results = [];
  each(o, function (index, value, o, i) {
    var response = callback.call(context, index, value, o, i);

    // if (false === response) return false;
    if (null !== response) results.push(response);
  });
  return results;
};

/**
 * Reduces a collection to a single value
 *
 * The reducer receives:
 *    (accumulator, value, index, source)
 *
 * @template T,R
 * @param {Collection<T>} o
 * @param {(accumulator: R|T, value: T, key: any, index: number, o: Collection<T>) => R} callback
 * @param {R} [initialValue] la valeur initiale
 * @returns {R} Returns the accumulated value
 */
export var reduce = function reduce(o, callback, initialValue) {
  var isInitialValueDefined = !isUndefined(initialValue);
  if (!sizeOf(o) && !isInitialValueDefined) {
    throw new Error('Nothing to reduce and no initial value');
  }
  var accumulator = !isInitialValueDefined ? map(o, function (key, v, o, i) {
    return i === 0 ? v : null;
  })[0] : initialValue;
  each(o, function (key, v, o, i) {
    if (i === 0 && !isInitialValueDefined) return;
    accumulator = callback(accumulator, v, key, i, o);
  });
  return accumulator;
};

/**
 * Creates a shallow or deep copy of one or more objects or arrays
 * If the first argument is `true`, nested plain objects are merged recursively.
 *
 * @template T
 * @param {...(boolean|T)} args
 * @returns {T} A copy of the merged result
 */
var _extend = function extend() {
  var deep = false;
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (isBoolean(args[0])) {
    deep = args.shift();
  }
  if (args.length < 2 || isUndefined(args[0]) || null === args[0]) {
    return args[0];
  }
  var dest = args[0];
  if (!isObject(dest)) {
    args[0] = dest = {};
  }
  foreach(args.slice(1), function (src) {
    if (isObject(src)) {
      for (var name in src) {
        if (deep && isPlainObject(src[name])) {
          dest[name] = _extend(true, {}, dest[name], src[name]);
        } else {
          dest[name] = src[name];
        }
      }
    }
  });
  return dest;
};

/**
 * Creates a deep copy of an Object or Array
 *
 * @template T
 * @param {T} o
 * @returns {T} The copy of o
 */
export { _extend as extend };
var _clone = function clone(o) {
  if (!isObject(o) && !isArray(o) || isWindow(o)) {
    return o;
  }
  var c = isObject(o) ? {} : [];
  each(o, function (key, value) {
    if (isObject(value)) {
      c[key] = _clone(value);
    } else {
      c[key] = value;
    }
  });
  return c;
};

/**
 * Merge multiple collections into a single array
 *
 * @template T
 * @param {Collection<T>} first
 * @param {Collection<T>} [second]
 * @param {...Collection<T>} args Remaining collections to merge
 * @returns {Array<T>} the resulted merged array
 */
export { _clone as clone };
var _merge = function merge(first) {
  var second = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var result = map(first, function (i, elem) {
    return elem;
  });
  each(second, function (i, elem) {
    result.push(elem);
  });
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }
  if (args.length) {
    return _merge.apply(void 0, [result].concat(args));
  }
  return result;
};
export { _merge as merge };