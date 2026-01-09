import {isArray, isArrayLike, isBoolean, isObject, isPlainObject, isString, isUndefined} from "./is.js";
import {isWindow} from "./dom.js";
import {sizeOf} from "./utils.js";

/**
 * @template T
 * @typedef {Array<T> | Set<T> | Map<any, T> | Object<string, T> | string} Collection
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
export const each = function(o, callback, context) {
    if (isPlainObject(o)) {
        let index = -1;

        for (let i in o)
            if (o.hasOwnProperty(i) && false === callback.call(context ?? o[i], i, o[i], o, ++index))
                return;
    }

    else if (isString(o)) {
        const arr = o.split('');

        for (let i = 0; i < arr.length; i++)
            if (false === callback.call(context ?? arr[i], i, arr[i], o, i))
                return o;

        return o;
    }

    else if (o instanceof Map) {
        let index = 0;
        for (const [key, value] of o.entries()) {
            if (false === callback.call(context ?? value, key, value, o, index++))
                return o;
        }
    }

    else if (o instanceof Set) {
        let index = 0;
        for (const value of o.values()) {
            if (false === callback.call(context ?? value, index, value, o, index))
                return o;

            index++;
        }
    }

    else if (isArrayLike(o)) {
        const arr = Array.from(o);

        for (let i = 0; i < arr.length; i++)
            if (false === callback.call(context || arr[i], i, arr[i], arr, i))
                return o;
    }

    return o;
}

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
export const foreach = function(o, callback, context) {
    return each(o, (key, value, o, index) => callback.apply(context || value, [value, key, o, index]), context)
}

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
export const map = function(o, callback, context) {
    let results = [];

    each(o, function(index, value, o, i) {
        const response = callback.call(context, index, value, o, i);

        // if (false === response) return false;
        if (null !== response) results.push(response);
    });

    return results;
}

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
export const reduce = function(o, callback, initialValue) {
    const isInitialValueDefined = !isUndefined(initialValue);

    if (!sizeOf(o) && !isInitialValueDefined) {
        throw new Error('Nothing to reduce and no initial value');
    }

    let accumulator = !isInitialValueDefined ? map(o, (key, v, o, i) => i === 0 ? v : null)[0] : initialValue;

    each(o, (key, v, o, i) => {
        if (i === 0 && !isInitialValueDefined) return;

        accumulator = callback(accumulator, v, key, i, o);
    })

    return accumulator;
}

/**
 * Creates a shallow or deep copy of one or more objects or arrays
 * If the first argument is `true`, nested plain objects are merged recursively.
 *
 * @template T
 * @param {...(boolean|T)} args
 * @returns {T} A copy of the merged result
 */
export const extend = function(...args) {
    let deep = false;

    if (isBoolean(args[0])) {
        deep = args.shift();
    }

    if (args.length < 2 || isUndefined(args[0]) || null === args[0]) {
        return args[0];
    }

    let dest = args[0];
    if (!isObject(dest)) {
        args[0] = dest = {};
    }

    foreach(args.slice(1), (src) => {
        if (isObject(src)) {
            for (const name in src) {
                if (deep && isPlainObject(src[name])) {
                    dest[name] = extend(true, {}, dest[name], src[name]);
                } else {
                    dest[name] = src[name];
                }
            }
        }
    })

    return dest;
}

/**
 * Creates a deep copy of an Object or Array
 *
 * @template T
 * @param {T} o
 * @returns {T} The copy of o
 */
export const clone = function(o) {
    if ((!isObject(o) && !isArray(o)) || isWindow(o)) {
        return o;
    }

    const c = isObject(o) ? {} : [];

    each(o, (key, value) => {
        if (isObject(value)) {
            c[key] = clone(value);
        } else {
            c[key] = value;
        }
    })

    return c;
}

/**
 * Merge multiple collections into a single array
 *
 * @template T
 * @param {Collection<T>} first
 * @param {Collection<T>} [second]
 * @param {...Collection<T>} args Remaining collections to merge
 * @returns {Array<T>} the resulted merged array
 */
export const merge = function(first, second = [], ...args)
{
    const result = map(first, (i, elem) => elem);

    each(second, function(i, elem) {
        result.push(elem);
    });

    if (args.length) {
        return merge(result, ...args);
    }

    return result;
}
