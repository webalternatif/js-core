import { each, map } from './traversal.js'
import { isArray, isInteger, isObject, isString, isUndefined } from './is.js'
import { round } from './math.js'
import { equals } from './utils.js'

/**
 * Checks if a value exists in an array or an object
 *
 * @param {any} value the searched value
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
 * inArray(5, [1, 2, 3]) // → false
 */
export const inArray = function (value, arr, index = 0, strict = false) {
    let ret = false

    each(arr, (i, val) => {
        if (i >= index) {
            if (strict) {
                if (val === value) {
                    ret = true
                    return false
                }
            } else {
                if (isObject(value) && isObject(val)) {
                    ret = equals(val, value)
                    return false
                } else if (isArray(value) && isObject(val)) {
                    ret = compareArray(val, value)
                    return false
                    // eslint-disable-next-line eqeqeq
                } else if (val == value) {
                    ret = true
                    return false
                }
            }
        }
    })

    return ret
}

/**
 * Returns the first index at which a given element can be found in an array or a string.
 * or -1 if it is not present.
 *
 * @param {Array<any>|string} arr - The array to search in
 * @param {any} elt - The element to search for
 * @param {number} [from] - The index to start the search from. Can be negative.
 * @returns {number} - The index of the element, or -1 if not found
 */
export const indexOf = function (arr, elt, from = 0) {
    const a = isString(arr) ? map(arr, (_, a) => a) : arr

    from = from < 0 ? Math.ceil(from) + a.length : Math.floor(from)

    for (; from < a.length; from++) {
        if (from in a && a[from] === elt) {
            return from
        }
    }

    return -1
}

/**
 * Returns the last index at which a given element can be found in an array or a string.
 * or -1 if it is not present.
 *
 * @param {Array<any>|string} arr - The array to search in
 * @param {any} elt - The element to search for
 * @param {number} [from] - The index to start the search from. Can be negative.
 * @returns {number} - The index of the element, or -1 if not found
 */
export const lastIndexOf = function (arr, elt, from = -1) {
    const a = isString(arr) ? map(arr, (_, a) => a) : arr

    from = from < 0 ? a.length + Math.ceil(from) : Math.floor(from)

    for (; from >= 0; from--) {
        if (from in a && a[from] === elt) {
            return from
        }
    }

    return -1
}

/**
 * Returns true if given arrays are equals
 *
 * @example
 *
 *
 * @param {Array} a1
 * @param {Array} a2
 * @returns {boolean}
 */
export const compareArray = function (a1, a2) {
    if (a1.length !== a2.length) {
        return false
    } else {
        for (let i = 0; i < a1.length; i++) {
            if (isArray(a1[i])) {
                if (!isArray(a2[i])) {
                    return false
                }

                return compareArray(a1[i], a2[i])
            } else if (a1[i] !== a2[i]) {
                return false
            }
        }
    }

    return true
}

export const arrayUnique = function (arr) {
    return arr.filter((el, index, arr) => index === indexOf(arr, el))
}

export const array_unique = arrayUnique

export const arrayDiff = (array1, array2, strict = false) => {
    return array1.filter((item) => !inArray(item, array2, 0, strict))
}

export const array_diff = arrayDiff

export const range = function (size, startAt = 0, step = 1) {
    size = round(size)
    step = round(step)

    const rng = []

    if (isUndefined(startAt) || size < 1 || step === 0 || size < Math.abs(step)) {
        return rng
    }

    const end = size * step

    if (isString(startAt)) {
        startAt = startAt.charCodeAt(0)

        for (let i = 0; step > 0 ? i < end : i > end; i += step) {
            rng.push(String.fromCharCode(startAt + i))
        }
    } else if (isInteger(startAt)) {
        for (let i = 0; step > 0 ? i < end : i > end; i += step) {
            rng.push(startAt + i)
        }
    }

    return rng
}
