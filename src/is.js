import {inArray} from "./array.js";

export const isString = function (str) {
    return typeof(str) == 'string' || Object.prototype.toString.call(str) === '[object String]';
}

export const isObject = function (o) {
    return !!o && !isArray(o) && typeof o === 'object';
}

export const isFunction = function(f) {
    return !!f && typeof f === 'function';
}

export const isPlainObject = function(o) {
    if (false === isObject(o)) return false
    if (undefined === o.constructor) return true
    if (false === isObject(o.constructor.prototype)) return false;
    if (o.constructor.prototype.hasOwnProperty('isPrototypeOf') === false) return false;

    return true;
}

export const isBoolean = function(b) {
    return b === true || b === false;
}

export const isBool = isBoolean;

export const isUndefined = function(v) {
    return typeof v === 'undefined';
}

export const isArray = function(a) {
    return Array.isArray(a);
}

export const isDate = function (o) {
    return !!o && Object.prototype.toString.call(o) === '[object Date]'
}

export const isEvent = function(o) {
    return isObject(o) && (!!o.preventDefault || /\[object Event\]/.test(o.constructor.toString()));
}

export const isInteger = function(n) {
    return /^[\-]?\d+$/.test(n + '');
}

export const isInt = isInteger

export const isFloat = function(n) {
    return /^[\-]?\d+(\.\d+)?$/.test(n + '');
}

export const isScalar = (value) => {
    const type = typeof value;

    return value === null || inArray(type, ['string', 'number', 'bigint', 'symbol', 'boolean']);
}

export const isEventSupported = (function() {
    const TAGNAMES = {
        select: 'input',
        change: 'input',
        submit: 'form',
        reset: 'form',
        error: 'img',
        load: 'img',
        abort: 'img'
    }

    function isEventSupported(eventName) {
        let el = document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        const isSupported = (eventName in el);

        el = null;

        return isSupported;
    }

    return isEventSupported;
})();

export const isTouchDevice = function()
{
    return isEventSupported('touchstart');
}
