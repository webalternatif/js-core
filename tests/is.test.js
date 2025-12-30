import {each} from "../src/traversal.js";
import {
    isObject,
    isPlainObject,
    isFunction,
    isDate,
    isBoolean,
    isBool,
    isEvent,
    isFloat, isScalar, isEventSupported, isTouchDevice
} from "../src/is.js";

describe('is methods', () => {
    describe('isObject()', () => {
        it('should return true for a plain object', () => {
            const obj = {key: 'value'};
            expect(isObject(obj)).toBe(true);
        })

        it('should return false for an array', () => {
            const arr = [1, 2, 3];
            expect(isObject(arr)).toBe(false);
        })

        it('should return true for an object created with Object.create', () => {
            const obj = Object.create(null);
            expect(isObject(obj)).toBe(true);
        })
    })

    describe('isArray()', () => {
        it('should return true for an empty array', () => {
            const arr = [];
            expect(isArray(arr)).toBe(true);
        })

        it('should return true for an array with elements', () => {
            const arr = [1, 2, 3];
            expect(isArray(arr)).toBe(true);
        })

        it('should return false for a plain object', () => {
            const obj = {key: 'value'};
            expect(isArray(obj)).toBe(false);
        })

        const isArray = Array.isArray;
        Array.isArray = undefined;

        it('should return true id Array.isArray is undefined', () => {
            const arr = [1, 2, 3];
            expect(isArray(arr)).toBe(true);
        })

        Array.isArray = isArray;
    })

    describe('isPlainObject()', () => {
        it('should return true for a plain object', () => {
            const obj = { key: 'value' };
            expect(isPlainObject(obj)).toBe(true);
        })

        it('should return false for null, undefined, array', () => {
            expect(isPlainObject(null)).toBe(false);
            expect(isPlainObject(undefined)).toBe(false);
            expect(isPlainObject([1, 2, 3])).toBe(false);
            expect(isPlainObject(() => {})).toBe(false);
        })

        it('should return true for an object created with Object.create(null)', () => {
            const obj = Object.create(null);
            expect(isPlainObject(obj)).toBe(true);
        })

        it('should return false for an object with a custom constructor', () => {
            function CustomConstructor() {}
            const obj = new CustomConstructor();
            expect(isPlainObject(obj)).toBe(false);
        })

        it('should return false for non-object values', () => {
            each([2, 'string', true, Symbol('sym')], (i, value) => {
                expect(isPlainObject(value)).toBe(false);
            })
        })

        it('should return false if isObject returns false for o.constructor.prototype', () => {
            const obj = {};
            obj.constructor = function CustomConstructor() {};
            expect(isPlainObject(obj)).toBe(false);
        })

        it('should return false if isFunction returns true', () => {
            const obj = function () {};
            expect(isPlainObject(obj)).toBe(false);
        })

        it('should return false if o.constructor.prototype is not an object', () => {
            const nonObjectPrototype = Object.create(null);
            nonObjectPrototype.constructor = {
                prototype: null,
            };

            const result = isPlainObject(nonObjectPrototype);

            expect(result).toBe(false);
        })
    })

    describe('isFunction()', () => {
        it('should return true for a regular and arrow functions', () => {
            expect(isFunction(function () {})).toBe(true);
            expect(isFunction(() => {})).toBe(true);
        })

        it('should return false for null, undefined, string, number, boolean, object, array, symbol', () => {
            expect(isFunction(null)).toBe(false);
            expect(isFunction(undefined)).toBe(false);
            expect(isFunction('Hello world')).toBe(false);
            expect(isFunction(2)).toBe(false);
            expect(isFunction(true)).toBe(false);
            expect(isFunction(false)).toBe(false);
            expect(isFunction({ key: 'value' })).toBe(false);
            expect(isFunction([1, 2, 3])).toBe(false);
            expect(isFunction(Symbol('f'))).toBe(false);
            expect(isFunction(class MyClass {})).toBe(true); // Les classes sont des fonctions
        })

        it('should return false for a function-like object', () => {
            const funcLike = { call: () => {} };
            expect(isFunction(funcLike)).toBe(false);
        })
    })

    describe('isDate()', () => {
        it('should return true for a valid Date object', () => {
            const date = new Date();
            expect(isDate(date)).toBe(true);
        })

        it('should return false for a string that looks like a date', () => {
            const dateString = '2023-01-01';
            expect(isDate(dateString)).toBe(false);
        })

        it('should return false for a number representing a timestamp', () => {
            const timestamp = Date.now();
            expect(isDate(timestamp)).toBe(false);
        })

        it('should return false for invalid Date objects', () => {
            const invalidDate = new Date('invalid-date');
            expect(isDate(invalidDate)).toBe(true);
        })
    })

    describe('isBoolean(), isBool()', () => {
        it('should return true for true and false', () => {
            expect(isBoolean(true)).toBe(true);
            expect(isBoolean(false)).toBe(true);
        })

        it('should return false for a string, a number, null and undefined', () => {
            expect(isBoolean('true')).toBe(false);
            expect(isBoolean('false')).toBe(false);
            expect(isBoolean(1)).toBe(false);
            expect(isBoolean(0)).toBe(false);
            expect(isBoolean(null)).toBe(false);
            expect(isBoolean(undefined)).toBe(false);
        })

        it('should be an alias of isBoolean', () => {
            expect(isBool === isBoolean).toBe(true);
        })
    })

    describe('isEvent()', () => {
        it('should return true for a valid DOM Event object', () => {
            const mockEvent = new Event('click');
            expect(isEvent(mockEvent)).toBe(true);
        })

        it('should return true for an object with a preventDefault method', () => {
            const mockEvent = {
                preventDefault: () => {},
            };

            expect(isEvent(mockEvent)).toBe(true);
        })

        it('should return true if constructor matches [object Event]', () => {
            const mockEvent = {
                constructor: { toString: () => '[object Event]' },
            };

            expect(isEvent(mockEvent)).toBe(true);
        })

        it('should return false for non-object inputs', () => {
            expect(isEvent(null)).toBe(false);
            expect(isEvent(undefined)).toBe(false);
            expect(isEvent(42)).toBe(false);
            expect(isEvent('string')).toBe(false);
        })
    })

    describe('isFloat() function()', () => {
        it('should return true for valid float strings', () => {
            expect(isFloat('3.14')).toBe(true);
            expect(isFloat('-3.14')).toBe(true);
            expect(isFloat('0.123')).toBe(true);
            expect(isFloat('-0.123')).toBe(true);
        })

        it('should return true for valid integers (as they are also floats)', () => {
            expect(isFloat('42')).toBe(true);
            expect(isFloat('-42')).toBe(true);
            expect(isFloat('0')).toBe(true);
        })

        it('should return true for valid float numbers', () => {
            expect(isFloat(3.14)).toBe(true);
            expect(isFloat(-3.14)).toBe(true);
            expect(isFloat(0.123)).toBe(true);
            expect(isFloat(-0.123)).toBe(true);
        })

        it('should return true for valid integer numbers', () => {
            expect(isFloat(42)).toBe(true);
            expect(isFloat(-42)).toBe(true);
            expect(isFloat(0)).toBe(true);
        })

        it('should return false for invalid float strings', () => {
            expect(isFloat('3.14.15')).toBe(false);
            expect(isFloat('abc')).toBe(false);
            expect(isFloat('-3.')).toBe(false);
            expect(isFloat('-.')).toBe(false);
            expect(isFloat('3-3')).toBe(false);
        })

        it('should return false for non-numeric values', () => {
            expect(isFloat(null)).toBe(false);
            expect(isFloat(undefined)).toBe(false);
            expect(isFloat({})).toBe(false);
            expect(isFloat([])).toBe(false);
            expect(isFloat(() => {})).toBe(false);
        })

        it('should return true for floats in exponential notation', () => {
            expect(isFloat('1e3')).toBe(false);
            expect(isFloat('1.23e3')).toBe(false);
        })

        it('should return true for numbers passed as strings', () => {
            expect(isFloat('123')).toBe(true);
            expect(isFloat('123.456')).toBe(true);
            expect(isFloat('-123.456')).toBe(true);
        })
    })

    describe('isScalar', () => {
        it('should return true for null', () => {
            expect(isScalar(null)).toBe(true);
        })

        it('should return true for strings', () => {
            expect(isScalar('hello')).toBe(true);
            expect(isScalar('')).toBe(true);
        })

        it('should return true for numbers', () => {
            expect(isScalar(42)).toBe(true);
            expect(isScalar(0)).toBe(true);
            expect(isScalar(-123.45)).toBe(true);
        })

        it('should return true for bigints', () => {
            expect(isScalar(10n)).toBe(true);
        })

        it('should return true for booleans', () => {
            expect(isScalar(true)).toBe(true);
            expect(isScalar(false)).toBe(true);
        })

        it('should return true for symbols', () => {
            expect(isScalar(Symbol('test'))).toBe(true);
        })

        it('should return false for objects', () => {
            expect(isScalar({})).toBe(false);
            expect(isScalar([])).toBe(false);
            expect(isScalar(() => {})).toBe(false);
        })

        it('should return false for undefined', () => {
            expect(isScalar(undefined)).toBe(false);
        })
    })

    describe('isEventSupported', () => {
        it('should return true for supported events on specific elements', () => {
            expect(isEventSupported('select')).toBe(true);
            expect(isEventSupported('change')).toBe(true);
            expect(isEventSupported('submit')).toBe(true);
            expect(isEventSupported('reset')).toBe(true);
            expect(isEventSupported('error')).toBe(true);
            expect(isEventSupported('load')).toBe(true);
            expect(isEventSupported('abort')).toBe(true);
        })

        it('should return true for generic events on a div', () => {
            expect(isEventSupported('click')).toBe(true);
            expect(isEventSupported('mouseover')).toBe(true);
            expect(isEventSupported('keydown')).toBe(true);
        })

        it('should return false for unsupported events', () => {
            expect(isEventSupported('unsupportedEvent')).toBe(false);
            expect(isEventSupported('customEvent')).toBe(false);
        })

        it('should handle empty event names gracefully', () => {
            expect(isEventSupported('')).toBe(false);
        })

        it('should handle null and undefined inputs gracefully', () => {
            expect(isEventSupported(null)).toBe(false);
            expect(isEventSupported(undefined)).toBe(false);
        })
    })

    describe('isTouchDevice()', () => {
        it('should return true if the device supports touchstart events', () => {
            jest.spyOn(document, 'createElement').mockImplementation(() => {
                return { ontouchstart: jest.fn() };
            })

            expect(isTouchDevice()).toBe(true);
            jest.restoreAllMocks();
        })

        it('should return false if the device does not support touchstart events', () => {
            jest.spyOn(document, 'createElement').mockImplementation(() => {
                return {};
            })

            expect(isTouchDevice()).toBe(false);
            jest.restoreAllMocks();
        })
    })
})
