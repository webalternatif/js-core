import {isArray, isBoolean, isObject, isPlainObject, isString, isUndefined} from "./is.js";
import {isWindow} from "./dom.js";
import {sizeOf} from "./utils.js";

export const each = function(o, callback, context) {
    const oToString = Object.prototype.toString.call(o);

    if (oToString === '[object Set]') {
        o = [...o];
    } else if (oToString === '[object Map]') {
        o = Object.fromEntries(o);
    }

    if (isArray(o)) {
        for (let i = 0; i < o.length; i++)
            if (false === callback.call(context || o[i], i, o[i], o, i))
                return;
    } else if (isObject(o)) {
        let index = -1;

        for (let i in o)
            if (o.hasOwnProperty(i) && false === callback.call(context || o[i], i, o[i], o, ++index))
                return;
    } else if (isString(o)) {
        const arr = o.split('');

        for (let i = 0; i < arr.length; i++)
            if (false === callback.call(context || arr[i], i, arr[i], o, i))
                return;
    }

    return o;
}

export const foreach = function(o, callback, context) {
    return each(o, (key, value, o, index) => callback.apply(context || value, [value, key, o, index]), context)
}

export const map = function(o, callback, context) {
    let results = [];

    each(o, function(index, value, o, i) {
        const response = callback.call(context, index, value, o, i);

        if (response !== null) {
            results.push(response);
        }
    });

    return results;
}

export const reduce = function(o, callback, initialValue) {
    const isInitialValueDefined = !isUndefined(initialValue);

    if (!sizeOf(o) && !isInitialValueDefined) {
        throw new Error('Nothing to reduce and no initial value');
    }

    let accumulator = !isInitialValueDefined ? map(o, (i, v) => i === 0 ? v : null)[0] : initialValue;

    each(o, (i, v) => {
        if (i === 0 && !isInitialValueDefined) {
            return true;
        }

        accumulator = callback(accumulator, v, i, o);
    })

    return accumulator;
}

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

    each(args.slice(1), (i, src) => {
        if (isObject(src)) {
            for (let name in src) {
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

export const clone = function(o) {
    if ((!isObject(o) && !isArray(o)) || isWindow(o)) {
        return o;
    }

    const c = isObject(o) ? {} : [];

    each(o, (i, value) => {
        if (isObject(value)) {
            c[i] = clone(value);
        } else {
            c[i] = value;
        }
    })

    return c;
}

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
