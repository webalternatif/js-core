import {
    equals,
    sizeOf,
    flatten, noop,
    strParseFloat, throttle, debounce
} from "../src/utils";

describe('utils methods', () => {
    describe('equals()', () => {
        it('should return true for strictly equal primitive values', () => {
            expect(equals(42, 42)).toBe(true);
            expect(equals('hello', 'hello')).toBe(true);
            expect(equals(true, true)).toBe(true);
        })

        it('should return false for different primitive values', () => {
            expect(equals(42, 24)).toBe(false);
            expect(equals('hello', 'world')).toBe(false);
            expect(equals(true, false)).toBe(false);
        })

        it('should return false if types are different', () => {
            expect(equals(42, '42')).toBe(false);
            expect(equals(true, 'true')).toBe(false);
        })

        it('should return false if one value is null or undefined', () => {
            expect(equals(null, {})).toBe(false);
            expect(equals({}, null)).toBe(false);
            expect(equals(undefined, {})).toBe(false);
        })

        it('should return true for deeply equal objects', () => {
            const obj1 = { a: 1, b: { c: 2 } };
            const obj2 = { a: 1, b: { c: 2 } };

            expect(equals(obj1, obj2)).toBe(true);
        })

        it('should return false for objects with different structures', () => {
            const obj1 = { a: 1, b: { c: 2 } };
            const obj2 = { a: 1, b: { d: 3 } };

            expect(equals(obj1, obj2)).toBe(false);
        })

        it('should return false for objects with different keys', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { a: 1, c: 3 };

            expect(equals(obj1, obj2)).toBe(false);
        })

        it('should return true for deeply nested empty objects', () => {
            const obj1 = {};
            const obj2 = {};

            expect(equals(obj1, obj2)).toBe(true);
        })

        it('should handle circular references gracefully', () => {
            const obj1 = {};
            const obj2 = {};
            obj1.self = obj1;
            obj2.self = obj2;

            expect(equals(obj1, obj2)).toBe(true);
        })

        it('should return true for empty objects', () => {
            const obj1 = {};
            const obj2 = {};

            expect(equals(obj1, obj2)).toBe(true);
        })

        it('should return false for objects with different lengths', () => {
            const obj1 = { a: 1 };
            const obj2 = { a: 1, b: 2 };

            expect(equals(obj1, obj2)).toBe(false);
        })
    })

    describe('sizeOf()', () => {
        it('should return the length of an array, object', () => {
            expect(sizeOf([1, 2, 3])).toBe(3);
            expect(sizeOf({ a: 1, b: 2, c: 3 })).toBe(3);
        })

        it('should return 0 for an empty array, empty object, null, undefined', () => {
            expect(sizeOf([])).toBe(0);
            expect(sizeOf({})).toBe(0);
            expect(sizeOf(null)).toBe(0);
            expect(sizeOf(undefined)).toBe(0);
        })
    })

    describe('flatten()', () => {
        it('should flatten a nested array', () => {
            const input = [1, [2, [3, [4, 5]]], 6];
            const result = flatten(input);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        })

        it('should flatten an object into an array', () => {
            const input = { a: 1, b: [2, { c: 3 }], d: 4 };
            const result = flatten(input);
            expect(result).toEqual([1, 2, 3, 4]);
        })

        it('should return a flat array when input is already flat', () => {
            const input = [1, 2, 3, 4, 5];
            const result = flatten(input);
            expect(result).toEqual([1, 2, 3, 4, 5]);
        })

        it('should return the input unchanged if it is not an object or array', () => {
            const input = 42;
            const result = flatten(input);
            expect(result).toBe(42);

            const inputString = 'hello';
            const resultString = flatten(inputString);
            expect(resultString).toBe('hello');
        })

        it('should handle null or undefined inputs', () => {
            expect(flatten(null)).toBe(null);
            expect(flatten(undefined)).toBe(undefined);
        })

        it('should handle an empty array', () => {
            const input = [];
            const result = flatten(input);
            expect(result).toEqual([]);
        })

        it('should handle an empty object', () => {
            const input = {};
            const result = flatten(input);
            expect(result).toEqual([]);
        })
    })

    describe('noop()', () => {
        it('should not perform any operation', () => {
            const spy = jest.fn(noop);
            spy();
            expect(spy).toHaveBeenCalledTimes(1);
        })
    })

    describe('strParseFloat()', () => {
        it('should parse a valid float string', () => {
            expect(strParseFloat('123.45')).toBe(123.45);
        })

        it('should parse a string with commas as decimal separator', () => {
            expect(strParseFloat('123,45')).toBe(123.45);
        })

        it('should parse a string with spaces', () => {
            expect(strParseFloat('  123.45  ')).toBe(123.45);
        })

        it('should handle a string with mixed spaces and commas', () => {
            expect(strParseFloat('  1 234,56  ')).toBe(1234.56);
        })

        it('should handle null input and return 0', () => {
            expect(strParseFloat(null)).toBe(0);
        })

        it('should handle undefined input and return 0', () => {
            expect(strParseFloat(undefined)).toBe(0);
        })

        it('should handle an empty string and return 0', () => {
            expect(strParseFloat('')).toBe(0);
        })

        it('should handle input that is already a number', () => {
            expect(strParseFloat(123.45)).toBe(123.45);
        })

        it('should handle input with extra characters gracefully', () => {
            expect(strParseFloat('123.45abc')).toBe(123.45);
        })

        it('should handle strings with no numeric values and return NaN', () => {
            expect(strParseFloat('abc')).toBeNaN();
        })
    })

    describe('throttle', () => {
        jest.useFakeTimers();

        it('should call the function immediately if leading is true', () => {
            const mockfunc = jest.fn();
            const throttled = throttle(mockfunc, 1000, true, false);

            throttled();
            expect(mockfunc).toHaveBeenCalledTimes(1);

            throttled();
            expect(mockfunc).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(1000);
            throttled();
            expect(mockfunc).toHaveBeenCalledTimes(2);
        })

        it('should not call the function immediately if leading is false', () => {
            const mockfunc = jest.fn();
            const throttled = throttle(mockfunc, 1000, false, true);

            throttled();
            expect(mockfunc).toHaveBeenCalledTimes(0);

            jest.advanceTimersByTime(1000);
            expect(mockfunc).toHaveBeenCalledTimes(1);
        })

        it('should call the function at the end if trailing is true', () => {
            const mockfunc = jest.fn();
            const throttled = throttle(mockfunc, 1000, false, true);

            throttled();
            jest.advanceTimersByTime(500);
            throttled();
            jest.advanceTimersByTime(500);
            expect(mockfunc).toHaveBeenCalledTimes(1);
        })

        it('should not call the function at the end if trailing is false', () => {
            const func = jest.fn();
            const throttled = throttle(func, 1000, true, false);

            throttled();
            jest.advanceTimersByTime(500);
            throttled();
            jest.advanceTimersByTime(500);
            expect(func).toHaveBeenCalledTimes(1);
        })

        it('should respect the wait time between calls', () => {
            const func = jest.fn();
            const throttled = throttle(func, 1000);

            throttled();
            expect(func).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(500);
            throttled();
            expect(func).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(500);
            throttled();
            expect(func).toHaveBeenCalledTimes(2);
        })

        it('should use the provided context', () => {
            const context = { value: 42 };
            const func = jest.fn(function() {
                expect(this.value).toBe(42);
            })

            const throttled = throttle(func, 1000, true, true, context);
            throttled();
        })

        it('should handle multiple calls within the wait period', () => {
            const func = jest.fn();
            const throttled = throttle(func, 1000);

            throttled();
            throttled();
            throttled();
            expect(func).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(1000);
            expect(func).toHaveBeenCalledTimes(2);
        })
    })

    describe('debounce', () => {
        jest.useFakeTimers();

        it('should call the function after the wait time', () => {
            const func = jest.fn();
            const debounced = debounce(func, 1000);

            debounced();
            expect(func).not.toHaveBeenCalled();

            jest.advanceTimersByTime(1000);
            expect(func).toHaveBeenCalledTimes(1);
        })

        it('should reset the timer if called again within the wait time', () => {
            const func = jest.fn();
            const debounced = debounce(func, 1000);

            debounced();
            jest.advanceTimersByTime(500);
            debounced();
            jest.advanceTimersByTime(500);

            expect(func).not.toHaveBeenCalled();

            jest.advanceTimersByTime(500);
            expect(func).toHaveBeenCalledTimes(1);
        })

        it('should call the function immediately if immediate is true', () => {
            const func = jest.fn();
            const debounced = debounce(func, 1000, true);

            debounced();
            expect(func).toHaveBeenCalledTimes(1);

            debounced();
            expect(func).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(1000);
            debounced();
            expect(func).toHaveBeenCalledTimes(2);
        })

        it('should use the provided context', () => {
            const context = { value: 42 };
            const func = jest.fn(function () {
                expect(this.value).toBe(42);
            })

            const debounced = debounce(func, 1000, false, context);
            debounced();

            jest.advanceTimersByTime(1000);
            expect(func).toHaveBeenCalledTimes(1);
        })

        it('should use the provided context', () => {
            const context = { value: 42 };
            const func = jest.fn(function () {
                expect(this.value).toBe(42);
            })
            const debounced = debounce(func, 1000, true, context);

            debounced();
            expect(func).toHaveBeenCalledTimes(1);

            debounced();
            expect(func).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(1000);
            debounced();
            expect(func).toHaveBeenCalledTimes(2);
        })

        it('should not call the function if never invoked after the delay', () => {
            const func = jest.fn();
            const debounced = debounce(func, 1000);

            debounced();
            jest.advanceTimersByTime(500);
            expect(func).not.toHaveBeenCalled();
        })
    })
})
