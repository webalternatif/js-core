import {each} from "./traversal.js";
import {isArray, isFunction, isObject} from "./is.js";
import {reverse} from "./string.js";

export const round = function(val, precision = 0) {
    return Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision);
}

export const floorTo = function(n, precision) {
    if (precision <= 0) throw new Error('Precision must be greater than 0');

    return round(Math.floor(n / precision) * precision, 6);
}

export const plancher = floorTo

export const min = function(list, cmp_func)
{
    if (isArray(list)) {
        return Math.min.apply(null, list);
    }

    let min;

    cmp_func = isFunction(cmp_func)
        ? cmp_func
        : function(a, b) {
            return a < b ? -1 : 1;
        }
    ;

    if (isObject(list)) {
        each(list, function(key, val, obj, index) {
            if (index === 0) {
                min = val;
            } else {
                min = cmp_func.call(null, min, val) > 0 ? val : min;
            }
        });
    }

    return min;
}

export const max = function(list, cmp_func)
{
    if (isArray(list)) {
        return Math.max.apply(null, list);
    }

    let max;

    cmp_func = isFunction(cmp_func)
        ? cmp_func
        : function(a, b) {
            return b - a;
        }
    ;

    if (isObject(list)) {
        each(list, function(key, val, obj, index) {
            if (index === 0) {
                max = val;
            } else {
                max = cmp_func.call(null, max, val) > 0 ? val : max;
            }
        });
    }

    return max;
}

/**
 * Converts a decimal number into hexadecimal
 *
 * @param {number} n
 * @returns {string}
 */
export const dec2hex = function(n)
{
    return n.toString(16);
}

/**
 * Converts a hexadecimal into a decimal number
 *
 * @param {string} hex
 * @returns {number}
 */
export const hex2dec = function(hex)
{
    hex = reverse(hex + '').toUpperCase();

    const c = '0123456789ABCDEF';
    let value = 0;

    each(hex, (i, char) => {
        const index = (c.indexOf(char));

        if (index === -1) {
            value = 0;
            return false;
        }

        value += ((index) * Math.pow(2, 4 * i));
    })

    return value;
}
