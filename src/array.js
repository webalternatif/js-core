import {each} from "./traversal.js";
import {isArray, isInteger, isObject, isString, isUndefined} from "./is.js";
import {round} from "./math.js";
import {equals} from "./utils.js";

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
export const inArray = function(value, arr, index = 0, strict = false) {
    let ret = false;

    each(arr, (i, val) => {
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
                    ret = compareArray(val, value);
                    return false;
                } else if (val == value) {
                    ret = true;
                    return false;
                }
            }
        }
    })

    return ret;
}

export const indexOf = function(arr, elt, from = 0) {
    from = from < 0 ? Math.ceil(from) + arr.length : Math.floor(from);

    for (; from < arr.length; from++) {
        if (from in arr && arr[from] === elt) {
            return from;
        }
    }

    return -1;
}

export const compareArray = function(a1, a2) {
    if (a1.length !== a2.length) {
        return false;
    } else {
        for (let i = 0; i < a1.length; i++) {
            if (isArray(a1[i])) {
                if (!isArray(a2[i])) {
                    return false;
                }

                return compareArray(a1[i], a2[i]);
            } else if (a1[i] !== a2[i]) {
                return false;
            }
        }
    }

    return true;
}

export const arrayUnique = function(arr) {
    return arr.filter((el, index, arr) => index === indexOf(arr, el));
}

export const array_unique = arrayUnique

export const arrayDiff = (array1, array2, strict = false) => {
    return array1.filter(item => !inArray(item, array2, 0, strict))
}

export const array_diff = arrayUnique

export const range = function(size, startAt = 0, step = 1) {
    size = round(size);
    step = round(step);

    const rng = [];

    if (isUndefined(startAt) || size < 1 || step === 0 || size < Math.abs(step)) {
        return rng;
    }

    const end = size * step;

    if (isString(startAt)) {
        startAt = startAt.charCodeAt(0);

        for (let i = 0; step > 0 ? i < end : i > end; i += step) {
            rng.push(String.fromCharCode(startAt + i));
        }
    } else if (isInteger(startAt)) {
        for (let i = 0; step > 0 ? i < end : i > end; i += step) {
            rng.push(startAt + i);
        }
    }

    return rng;
}
