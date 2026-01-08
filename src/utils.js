import {each, map} from "./traversal.js";
import {isArray, isFunction, isObject, isUndefined} from "./is.js";

export const equals = function(o1, o2, seen = new WeakMap()) {
    if (o1 === o2) return true;

    if (typeof o1 !== typeof o2 || o1 == null || o2 == null) {
        return false;
    }

    if (isObject(o1)) {
        if (seen.has(o1)) {
            return seen.get(o1) === o2;
        }

        seen.set(o1, o2);

        const keys1 = Object.keys(o1),
            keys2 = Object.keys(o2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        return keys1.every((key) => equals(o1[key], o2[key], seen));
    }

    return false;
}

export const noop = function() {}

export const sizeOf = function(o) {
    return map(o, noop).length;
}

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
export const flatten = function(o) {
    if (isObject(o) || isArray(o)) {
        return [].concat.apply([], map(o, (i, val) => flatten(val)))
    }

    return o;
}

export const strParseFloat = function(val) {
    if (!val) return 0;

    return parseFloat((val + '')
        .replace(/\s/g, '')
        .replace(',', '.'));
}

export const throttle = function(func, wait, leading = true, trailing = true, context = null) {
    let timeout = null;
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();

        if (!lastCall && !leading) {
            lastCall = now;
        }

        const remaining = wait - (now - lastCall);

        if (remaining <= 0 || remaining > wait) {
            lastCall = now;
            func.apply(context || this, args);
        } else if (!timeout && trailing) {
            timeout = setTimeout(() => {
                timeout = null;
                lastCall = leading ? Date.now() : 0;
                func.apply(context || this, args);
            }, remaining);
        }
    }
}

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
export const debounce = function(func, wait, immediate = false, context = null) {
    let timeout = null;
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();

        if (immediate) {
            if (!lastCall) {
                lastCall = now;
                func.apply(context || this, args);
            }
        }

        clearTimeout(timeout);
        timeout = null;

        timeout = setTimeout(() => {
            lastCall = now;
            clearTimeout(timeout);
            timeout = null;
            func.apply(context || this, args);
        }, wait);
    }
}
