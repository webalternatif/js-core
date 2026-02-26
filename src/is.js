import { inArray } from './array.js'

/**
 * @param {any} str
 * @returns {boolean}
 */
export const isString = function (str) {
    return typeof str === 'string' || Object.prototype.toString.call(str) === '[object String]'
}

/**
 * @param {any} o
 * @returns {boolean}
 */
export const isObject = function (o) {
    return !!o && !isArray(o) && typeof o === 'object'
}

/**
 * @param {any} f
 * @returns {boolean}
 */
export const isFunction = function (f) {
    return !!f && typeof f === 'function'
}

/**
 * @param {any} o
 * @returns {boolean}
 */
export const isPlainObject = function (o) {
    if (false === isObject(o)) return false
    if (undefined === o.constructor) return true
    if (false === isObject(o.constructor.prototype)) return false
    if (o.constructor.prototype.hasOwnProperty('isPrototypeOf') === false) return false

    return true
}

/**
 * @param {any} b
 * @returns {boolean}
 */
export const isBoolean = function (b) {
    return b === true || b === false
}

export const isBool = isBoolean

/**
 * @param {any} v
 * @returns {boolean}
 */
export const isUndefined = function (v) {
    return typeof v === 'undefined'
}

/**
 * @param {any} o
 * @returns {boolean}
 */
export const isArrayLike = function (o) {
    return (
        !!o &&
        !isString(o) &&
        !isFunction(o) &&
        isInt(o.length) &&
        // && o.length >= 0
        Number.isFinite(o.length)
    )
}

/**
 * @param {any} a
 * @returns {boolean}
 */
export const isArray = function (a) {
    return Array.isArray(a)
}

/**
 * @param {any} o
 * @returns {boolean}
 */
export const isDate = function (o) {
    return !!o && Object.prototype.toString.call(o) === '[object Date]'
}

/**
 * @param {any} o
 * @returns {boolean}
 */
export const isEvent = function (o) {
    return isObject(o) && (!!o.preventDefault || /\[object Event\]/.test(o.constructor.toString()))
}

/**
 * @param {any} n
 * @returns {boolean}
 */
export const isInteger = function (n) {
    return /^[-+]?\d+$/.test(n + '')
}

export const isInt = isInteger

/**
 * @param {any} n
 * @returns {boolean}
 */
export const isFloat = function (n) {
    return /^[-+]?\d+(\.\d+)?$/.test(n + '')
}

/**
 * @param {any} v
 * @returns {boolean}
 */
export const isScalar = (v) => {
    const type = typeof v

    return null === v || inArray(type, ['string', 'number', 'bigint', 'symbol', 'boolean'])
}

/**
 * @param {string} eventName
 * @returns {boolean}
 */
export const isEventSupported = (function () {
    const TAGNAMES = {
        select: 'input',
        change: 'input',
        submit: 'form',
        reset: 'form',
        error: 'img',
        load: 'img',
        abort: 'img',
    }

    function isEventSupported(eventName) {
        let el = document.createElement(TAGNAMES[eventName] || 'div')
        eventName = 'on' + eventName
        const isSupported = eventName in el

        el = null

        return isSupported
    }

    return isEventSupported
})()

/**
 * @returns {boolean}
 */
export const isTouchDevice = function () {
    return isEventSupported('touchstart')
}

/**
 * Checks whether the given value is the global `window` object.
 *
 * @example
 * isWindow(window) // true
 * isWindow(globalThis) // true (in browsers)
 *
 * @param {any} o - Value to test
 * @returns {boolean} - `true` if the value is the browser window object
 */
export const isWindow = function (o) {
    return !!o && o === o.window
}

/**
 * Checks whether the given value is the global `document` object.
 *
 * @example
 * isDocument(document) // true (in browsers)
 * isDocument(window.document) // true (in browsers)
 * isDocument({document}) // false
 *
 * @param {any} o - Value to test
 * @returns {boolean} - `true` if the value is the browser document object
 */
export const isDocument = function (o) {
    return !!o && o.nodeType === 9
}

/**
 * Checks whether the given value is a DOM Element.
 *
 * @example
 * const el = document.createElement('div')
 * isDomElement(el) // true
 *
 * @param {any} o - Value to test
 * @returns {boolean} - `true` if the value is a DOM Element
 */
export const isDomElement = function (o) {
    return isObject(o) && 1 === o.nodeType && !isPlainObject(o)
}
