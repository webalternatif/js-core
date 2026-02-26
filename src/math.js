import { each } from './traversal.js'
import { isFunction } from './is.js'
import { reverse } from './string.js'

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
export const round = function (val, precision = 0) {
    return Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision)
}

/**
 * Rounds down to the nearest multiple of the precision
 *
 * @param {number} val
 * @param {number} precision
 * @returns {number} - The rounded value
 */
export const floorTo = function (val, precision) {
    if (precision <= 0) throw new Error('Precision must be greater than 0')

    return round(Math.floor(val / precision) * precision, 6)
}

export const plancher = floorTo

/**
 * @template T
 * @param {Iterable<T>|Record<string, T>} list
 * @param {(a: T, b: T) => number} [cmp_func]
 * @returns {T|undefined}
 */
export const min = function (list, cmp_func) {
    cmp_func = isFunction(cmp_func) ? cmp_func : (a, b) => (a < b ? -1 : 1)

    return compare(list, cmp_func)
}

/**
 * @template T
 * @param {Collection<T>} list
 * @param {(a: T, b: T) => number} [cmp_func]
 * @returns {T|undefined}
 */
export const max = function (list, cmp_func) {
    cmp_func = isFunction(cmp_func) ? cmp_func : (a, b) => (a > b ? -1 : 1)

    return compare(list, cmp_func)
}

/**
 * @template T
 * @param {Collection<T>} list
 * @param {(a: T, b: T) => number} [cmp_func]
 * @returns {T|undefined}
 */
function compare(list, cmp_func) {
    let result

    each(list, function (key, val, obj, index) {
        if (index === 0) {
            result = val
        } else {
            result = cmp_func.call(null, result, val) > 0 ? val : result
        }
    })

    return result
}

/**
 * Converts a decimal number into hexadecimal
 *
 * @param {number} n
 * @returns {string}
 */
export const dec2hex = function (n) {
    return n.toString(16)
}

/**
 * Converts a hexadecimal into a decimal number
 *
 * @param {string} hex
 * @returns {number}
 */
export const hex2dec = function (hex) {
    hex = reverse(hex + '').toUpperCase()

    const c = '0123456789ABCDEF'
    let value = 0

    each(hex, (i, char) => {
        const index = c.indexOf(char)

        if (index === -1) {
            value = 0
            return false
        }

        value += index * Math.pow(2, 4 * i)
    })

    return value
}
