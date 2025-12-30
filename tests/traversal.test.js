import {
    each, foreach,
    map,
    extend,
    merge,
    clone, reduce
} from "../src/traversal.js";

describe('traversal methods', () => {
    describe('each()', () => {
        it('should iterate over an array and execute the callback for each element', () => {
            const array = [1, 2, 3];
            const mockCallback = jest.fn();

            each(array, mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(array.length);
            expect(mockCallback).toHaveBeenCalledWith(0, 1, array, 0);
            expect(mockCallback).toHaveBeenCalledWith(1, 2, array, 1);
            expect(mockCallback).toHaveBeenCalledWith(2, 3, array, 2);
        });

        it('should iterate over an object and execute the callback for each key-value pair', () => {
            const obj = {a: 1, b: 2, c: 3};
            const mockCallback = jest.fn();

            each(obj, mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(Object.keys(obj).length);
            expect(mockCallback).toHaveBeenCalledWith('a', 1, obj, 0);
            expect(mockCallback).toHaveBeenCalledWith('b', 2, obj, 1);
            expect(mockCallback).toHaveBeenCalledWith('c', 3, obj, 2);
        });

        it('should allow the callback to stop iteration by returning false', () => {
            const mockCallback = jest.fn((key, value) => value !== 2);
            const array = [1, 2, 3];

            each(array, mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(2);
            expect(mockCallback).toHaveBeenCalledWith(0, 1, array, 0);
            expect(mockCallback).toHaveBeenCalledWith(1, 2, array, 1);
        });

        it('should handle string inputs by treating them as arrays of characters', () => {
            const mockCallback = jest.fn((key, value) => value !== 2);
            const str = 'abc';

            each(str, mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(str.length);
            expect(mockCallback).toHaveBeenCalledWith(0, 'a', str, 0);
            expect(mockCallback).toHaveBeenCalledWith(1, 'b', str, 1);
            expect(mockCallback).toHaveBeenCalledWith(2, 'c', str, 2);
        });

        it('should bind the callback to the provided context if given', () => {
            const context = Symbol('context');
            const mockCallback = jest.fn(function() {
                return context === this;
            });
            const array = [1, 2, 3];

            each(array, mockCallback, context);

            expect(mockCallback).toHaveReturnedWith(true);
        });

        it('should return the original object or array', () => {
            const array = [1, 2, 3];
            const obj = { a: 1, b: 2, c: 3 };

            const returnedArray = each(array, jest.fn());
            const returnedObj = each(obj, jest.fn());

            expect(returnedArray).toBe(array);
            expect(returnedObj).toBe(obj);
        });

        it('should skip inherited properties and do nothing', () => {
            const prototype = { inheritedKey: 'value' };
            const obj = Object.create(prototype);

            const mockCallback = jest.fn();

            each(obj, mockCallback);

            expect(mockCallback).not.toHaveBeenCalled();
        });
    });

    describe('foreach', () => {
        it('should call the callback for each item in an array', () => {
            const mockCallback = jest.fn();
            const array = [10, 20, 30];

            foreach(array, mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(3);
            expect(mockCallback).toHaveBeenNthCalledWith(1, 10, 0, array, 0);
            expect(mockCallback).toHaveBeenNthCalledWith(2, 20, 1, array, 1);
            expect(mockCallback).toHaveBeenNthCalledWith(3, 30, 2, array, 2);
        });

        it('should call the callback for each property in an object', () => {
            const mockCallback = jest.fn();
            const obj = { a: 1, b: 2, c: 3 };

            foreach(obj, mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(3);
            expect(mockCallback).toHaveBeenNthCalledWith(1, 1, 'a', obj, 0);
            expect(mockCallback).toHaveBeenNthCalledWith(2, 2, 'b', obj, 1);
            expect(mockCallback).toHaveBeenNthCalledWith(3, 3, 'c', obj, 2);
        });

        it('should respect the provided context', () => {
            const context = { multiplier: 2 };
            const mockCallback = jest.fn(function (value) {
                return value * this.multiplier;
            });

            const array = [1, 2, 3];
            foreach(array, mockCallback, context);

            expect(mockCallback.mock.instances[0]).toBe(context);
            expect(mockCallback).toHaveBeenNthCalledWith(1, 1, 0, array, 0);
            expect(mockCallback).toHaveBeenNthCalledWith(2, 2, 1, array, 1);
            expect(mockCallback).toHaveBeenNthCalledWith(3, 3, 2, array, 2);
        });

        it('should handle an empty array without error', () => {
            const mockCallback = jest.fn();
            const array = [];

            foreach(array, mockCallback);

            expect(mockCallback).not.toHaveBeenCalled();
        });

        it('should handle an empty object without error', () => {
            const mockCallback = jest.fn();
            const obj = {};

            foreach(obj, mockCallback);

            expect(mockCallback).not.toHaveBeenCalled();
        });

        it('should return the result of each', () => {
            const obj = { a: 1 };
            const callback = jest.fn();

            const result = foreach(obj, callback);
            expect(result).toBe(each(obj, callback));
        });
    });

    describe('map()', () => {
        it('should map over an array and apply the callback', () => {
            const inputArray = [1, 2, 3];
            const mockCallback = jest.fn((index, value) => value * 2);
            const result = map(inputArray, mockCallback);

            expect(result).toEqual([2, 4, 6]);
            expect(mockCallback).toHaveBeenCalledTimes(inputArray.length);
            expect(mockCallback).toHaveBeenCalledWith(0, 1, inputArray, 0);
            expect(mockCallback).toHaveBeenCalledWith(1, 2, inputArray, 1);
            expect(mockCallback).toHaveBeenCalledWith(2, 3, inputArray, 2);
        })

        it('should map over an object and apply the callback', () => {
            const inputObject = { a: 1, b: 2, c: 3 };
            const mockCallback = jest.fn((key, value) => `${key}:${value}`);
            const result =map(inputObject, mockCallback);

            expect(result).toEqual(['a:1', 'b:2', 'c:3']);
            expect(mockCallback).toHaveBeenCalledTimes(Object.keys(inputObject).length);
            expect(mockCallback).toHaveBeenCalledWith('a', 1, inputObject, 0);
            expect(mockCallback).toHaveBeenCalledWith('b', 2, inputObject, 1);
            expect(mockCallback).toHaveBeenCalledWith('c', 3, inputObject, 2);
        })

        it('should exclude null responses from the results', () => {
            const inputArray = [1, 2, 3];
            const mockCallback = jest.fn((index, value) => (value % 2 === 0 ? null : value));
            const result = map(inputArray, mockCallback);

            expect(result).toEqual([1, 3]);
            expect(mockCallback).toHaveBeenCalledTimes(inputArray.length);
        })

        it('should handle an empty array', () => {
            const inputArray = [];
            const mockCallback = jest.fn();
            const result = map(inputArray, mockCallback);

            expect(result).toEqual([]);
            expect(mockCallback).not.toHaveBeenCalled();
        })

        it('should bind the callback to the provided context', () => {
            const inputArray = [1, 2, 3];
            const context = { multiplier: 2 };
            const mockCallback = jest.fn(function (index, value) {
                return value * this.multiplier;
            });
            const result = map(inputArray, mockCallback, context);

            expect(result).toEqual([2, 4, 6]);
            expect(mockCallback).toHaveBeenCalledTimes(inputArray.length);
        })

        it('should return an empty array if no items produce a result', () => {
            const inputArray = [1, 2, 3];
            const mockCallback = jest.fn(() => null);
            const result = map(inputArray, mockCallback);

            expect(result).toEqual([]);
            expect(mockCallback).toHaveBeenCalledTimes(inputArray.length);
        })
    });

    describe('reduce', () => {
        it('should sum all values in an array', () => {
            const arr = [1, 2, 3, 4];
            const result = reduce(arr, (acc, val) => acc + val, 1);
            expect(result).toBe(11);
        });

        it('should work without an initial value for arrays', () => {
            const arr = [1, 2, 3, 4];
            const result = reduce(arr, (acc, val) => acc + val);
            expect(result).toBe(10);
        });

        it('should reduce an object\'s values', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = reduce(obj, (acc, val) => acc + val, 0);
            expect(result).toBe(6);
        });

        it('should concatenate strings in an array', () => {
            const arr = ['a', 'b', 'c'];
            const result = reduce(arr, (acc, val) => acc + val, '');
            expect(result).toBe('abc');
        });

        it('should reduce an object with keys and values', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = reduce(obj, (acc, val, key) => {
                acc[key] = val * 2;
                return acc;
            }, {});
            expect(result).toEqual({ a: 2, b: 4, c: 6 });
        });

        it('should handle empty arrays with initial value', () => {
            const arr = [];
            const result = reduce(arr, (acc, val) => acc + val, 10);
            expect(result).toBe(10);
        });

        it('should handle empty arrays without initial value', () => {
            const arr = [];
            expect(() => reduce(arr, (acc, val) => acc + val)).toThrow();
        });

        it('should reduce a Set', () => {
            const set = new Set([1, 2, 3]);
            const result = reduce(set, (acc, val) => acc + val, 0);
            expect(result).toBe(6);
        });

        it('should reduce a Map\'s values', () => {
            const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
            const result = reduce(map, (acc, val) => acc + val, 0);
            expect(result).toBe(6);
        });

        it('should handle non-array-like objects gracefully', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = reduce(obj, (acc, val) => acc + val, 0);
            expect(result).toBe(6);
        });
    });

    describe('extend()', () => {
        it('should return the first argument if less than two arguments are provided', () => {
            const obj = { a: 1 };
            expect(extend(obj)).toEqual(obj);
            expect(extend(undefined)).toBeUndefined();
            expect(extend(null)).toBeNull();
        })

        it('should merge two objects shallowly', () => {
            const obj1 = { a: 1 };
            const obj2 = { b: 2 };
            const result = extend({}, obj1, obj2);
            expect(result).toEqual({ a: 1, b: 2 });
        })

        it('should overwrite properties in shallow merge', () => {
            const obj1 = { a: 1 };
            const obj2 = { a: 2 };
            const result = extend({}, obj1, obj2);
            expect(result).toEqual({ a: 2 });
        })

        it('should deep merge nested objects when deep is true', () => {
            const obj1 = { a: { b: 1 } };
            const obj2 = { a: { c: 2 } };
            const result = extend(true, {}, obj1, obj2);
            expect(result).toEqual({ a: { b: 1, c: 2 } });
        })

        it('should not modify source objects during shallow merge', () => {
            const obj1 = { a: 1 };
            const obj2 = { b: 2 };
            extend({}, obj1, obj2);
            expect(obj1).toEqual({ a: 1 });
            expect(obj2).toEqual({ b: 2 });
        })

        it('should not modify source objects during deep merge', () => {
            const obj1 = { a: { b: 1 } };
            const obj2 = { a: { c: 2 } };
            extend(true, {}, obj1, obj2);
            expect(obj1).toEqual({ a: { b: 1 } });
            expect(obj2).toEqual({ a: { c: 2 } });
        })

        it('should handle arrays in shallow merge', () => {
            const obj1 = { a: [1, 2] };
            const obj2 = { b: [3, 4] };
            const result = extend({}, obj1, obj2);
            expect(result).toEqual({ a: [1, 2], b: [3, 4] });
        })

        it('should handle arrays in deep merge', () => {
            const obj1 = { a: [1, 2] };
            const obj2 = { a: [3, 4] };
            const result = extend(true, {}, obj1, obj2);
            expect(result).toEqual({ a: [3, 4] });
        })

        it('should skip non-object sources in shallow merge', () => {
            const obj1 = { a: 1 };
            const nonObject = null;
            const result = extend({}, obj1, nonObject);
            expect(result).toEqual({ a: 1 });
        })

        it('should skip non-object sources in deep merge', () => {
            const obj1 = { a: 1 };
            const nonObject = undefined;
            const result = extend(true, {}, obj1, nonObject);
            expect(result).toEqual({ a: 1 });
        })

        it('should merge multiple objects', () => {
            const obj1 = { a: 1 };
            const obj2 = { b: 2 };
            const obj3 = { c: 3 };
            const result = extend({}, obj1, obj2, obj3);
            expect(result).toEqual({ a: 1, b: 2, c: 3 });
        })

        it('should overwrite properties in the correct order', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { b: 3, c: 4 };
            const result = extend({}, obj1, obj2);
            expect(result).toEqual({ a: 1, b: 3, c: 4 });
        })

        it('should create a new object when the destination is not an object', () => {
            const result = extend(42, { key: 'value' });

            expect(result).toEqual({ key: 'value' });
        });
    })

    describe('clone()', () => {
        it('should return the input if it is neither an object nor an array', () => {
            expect(clone(42)).toBe(42);
        });

        it('should return the input if it is a window object', () => {
            expect(clone(window)).toBe(window);
        });

        it('should clone a plain object', () => {
            const input = { a: 1, b: 2 };
            const result = clone(input);

            expect(result).toEqual(input);
            expect(result).not.toBe(input);
        });

        it('should clone a nested object', () => {
            const input = { a: { b: 2 }, c: 3 };
            const result = clone(input);

            expect(result).toEqual(input);
            expect(result).not.toBe(input);
            expect(result.a).toEqual(input.a);
            expect(result.a).not.toBe(input.a);
        });

        it('should clone an array', () => {
            const input = [1, 2, 3];
            const result = clone(input);

            expect(result).toEqual(input);
            expect(result).not.toBe(input);
        });

        it('should handle undefined, null input', () => {
            expect(clone(null)).toBe(null);
            expect(clone(undefined)).toBe(undefined);
        });

        it('should handle mixed types in an object', () => {
            const input = {
                a: 1,
                b: [2, 3],
                c: { d: 4 },
            };

            const result = clone(input);

            expect(result).toEqual(input);
            expect(result).not.toBe(input);
        });
    });

    describe('merge function', () => {
        it('should merge two arrays correctly', () => {
            const first = [1, 2];
            const second = [3, 4];

            expect(merge(first, second)).toEqual([1, 2, 3, 4]);
        });

        it('should merge multiple arrays recursively', () => {
            const first = [1];
            const second = [2, 3];
            const third = [4, 5];
            const fourth = [6];
            const expectedResult = [1, 2, 3, 4, 5, 6];

            const result = merge(first, second, third, fourth);
            expect(result).toEqual(expectedResult);
        });

        it('should handle empty arrays correctly', () => {
            const first = [];
            const second = [1, 2, 3];
            const expectedResult = [1, 2, 3];

            const result = merge(first, second);
            expect(result).toEqual(expectedResult);

            const result2 = merge([], []);
            expect(result2).toEqual([]);
        });

        it('should handle arrays with mixed data types', () => {
            const first = [1, 'a', { key: 'value' }];
            const second = [true, null, [2, 3]];
            const expectedResult = [1, 'a', { key: 'value' }, true, null, [2, 3]];

            const result = merge(first, second);
            expect(result).toEqual(expectedResult);
        });

        it('should not modify the original arrays', () => {
            const first = [1, 2];
            const second = [3, 4];

            merge(first, second);

            expect(first).toEqual([1, 2]);
            expect(second).toEqual([3, 4]);
        });

        it('should return the first array if no additional arrays are provided', () => {
            const first = [1, 2];
            const expectedResult = [1, 2];

            const result = merge(first);
            expect(result).toEqual(expectedResult);
        });

        it('should return an empty array if no arrays are provided', () => {
            const expectedResult = [];

            const result = merge([]);
            expect(result).toEqual(expectedResult);
        });

        it('should stop iteration when callback returns false for an object', () => {
            const obj = { a: 1, b: 2, c: 3, d: 4 };
            const mockCallback = jest.fn((key, value, originalObj, index) => {
                if (value === 3) return false;
            });

            each(obj, mockCallback);

            expect(mockCallback).toHaveBeenCalledTimes(3);
            expect(mockCallback).toHaveBeenCalledWith('a', 1, obj, 0);
            expect(mockCallback).toHaveBeenCalledWith('b', 2, obj, 1);
            expect(mockCallback).toHaveBeenCalledWith('c', 3, obj, 2);
        });
    });
})
