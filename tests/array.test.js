import * as traversal from "../src/traversal.js";
import {arrayDiff, arrayUnique, compareArray, inArray, indexOf, range} from "../src/array.js";
import {each} from "../src/traversal.js";

describe('array methods', () => {
    beforeEach(() => {
        jest.spyOn(traversal, 'each');
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

    describe('inArray()', () => {
        it('should return true if the value exists in the array (non-strict)', () => {
            const arr = [1, '2', 3];
            const result = inArray(2, arr);
            expect(result).toBe(true);
        })

        it('should return false if the value does not exist in the array (non-strict)', () => {
            const arr = [1, '3', 4];
            const result = inArray(2, arr);
            expect(result).toBe(false);
        })

        it('should return true if the value exists in the array (strict)', () => {
            const arr = [1, 2, 3];
            const result = inArray(2, arr, 0, true);
            expect(result).toBe(true);
        })

        it('should return false if the value does not exist in the array (strict)', () => {
            const arr = [1, '2', 3];
            const result = inArray(2, arr, 0, true);
            expect(result).toBe(false);
        })

        it('should start searching from the specified index', () => {
            const arr = [1, 2, 3, 4];
            const result = inArray(2, arr, 2);
            expect(result).toBe(false);
        })

        it('should return false for an empty array', () => {
            const arr = [];
            const result = inArray(1, arr);
            expect(result).toBe(false);
        })

        it('should stop iteration when the value is found', () => {
            const arr = [1, 2, 3];
            const mockEach = jest.fn((array, callback) => {
                callback(0, 1);
                callback(1, 2);
            })
            each.mockImplementation(mockEach);

            const result = inArray(2, arr);

            expect(result).toBe(true);
            expect(mockEach).toHaveBeenCalledTimes(1);
        })

        it('should handle complex values (e.g., objects)', () => {
            const obj = { id: 1 };
            const arr = [{ id: 2 }, obj, { id: 3 }];
            const result = inArray(obj, arr, 0, true);
            expect(result).toBe(true);
        })

        it('should return false for objects with loose equality but different references', () => {
            const obj = { id: 1 };
            const arr = [{ id: 1 }, { id: 2 }];
            const result = inArray(obj, arr, 0, true);
            expect(result).toBe(false);
        })
    })

    describe('indexOf()', () => {
        it('should return the correct index of an element in the array', () => {
            const arr = [10, 20, 30, 40, 50];
            expect(indexOf(arr, 30)).toBe(2);
        })

        it('should return -1 if the element is not in the array', () => {
            const arr = [10, 20, 30, 40, 50];
            expect(indexOf(arr, 60)).toBe(-1);
        })

        it('should start searching from the given index', () => {
            const arr = [10, 20, 30, 40, 50];
            expect(indexOf(arr, 30, 3)).toBe(-1);
            expect(indexOf(arr, 50, 3)).toBe(4);
        })

        it('should handle negative start indices', () => {
            const arr = [10, 20, 30, 40, 50];
            expect(indexOf(arr, 30, -3)).toBe(2);
            expect(indexOf(arr, 10, -5)).toBe(0);
        })

        it('should return -1 for an empty array', () => {
            const arr = [];
            expect(indexOf(arr, 10)).toBe(-1);
        })

        it('should skip holes in sparse arrays', () => {
            const arr = [10, , 30, , 50]; // Sparse array
            expect(indexOf(arr, undefined)).toBe(-1); // undefined is not explicitly in the array
            expect(indexOf(arr, 30)).toBe(2); // Finds 30 despite the holes
        })

        it('should return the first occurrence of the element', () => {
            const arr = [10, 20, 30, 20, 10];
            expect(indexOf(arr, 20)).toBe(1); // Returns the first occurrence
        })

        it('should work when from is larger than the array length', () => {
            const arr = [10, 20, 30];
            expect(indexOf(arr, 20, 10)).toBe(-1); // Starts beyond the array, no search
        })

        it('should work when from is exactly the array length', () => {
            const arr = [10, 20, 30];
            expect(indexOf(arr, 30, 3)).toBe(-1); // Starts at the end, no search
        })
    })

    describe('compareArray()', () => {
        it('should return true for identical arrays', () => {
            const arr1 = [1, 2, 3];
            const arr2 = [1, 2, 3];
            expect(compareArray(arr1, arr2)).toBe(true);
        })

        it('should return false for arrays with different lengths', () => {
            const arr1 = [1, 2, 3];
            const arr2 = [1, 2];
            expect(compareArray(arr1, arr2)).toBe(false);
        })

        it('should return true for nested identical arrays', () => {
            const arr1 = [1, [2, 3], 4];
            const arr2 = [1, [2, 3], 4];
            expect(compareArray(arr1, arr2)).toBe(true);
        })

        it('should return false for nested arrays with different values', () => {
            const arr1 = [1, [2, 3], 4];
            const arr2 = [1, [2, 4], 4];
            expect(compareArray(arr1, arr2)).toBe(false);
        })

        it('should return false if one array has nested arrays and the other does not', () => {
            const arr1 = [1, [2, 3], 4, 5];
            const arr2 = [1, 2, 3, 4];
            expect(compareArray(arr1, arr2)).toBe(false);
            expect(compareArray(arr2, arr1)).toBe(false);
        })

        it('should return true for empty arrays', () => {
            const arr1 = [];
            const arr2 = [];
            expect(compareArray(arr1, arr2)).toBe(true);
        })

        it('should return false for arrays with different primitive values', () => {
            const arr1 = [1, 2, 3];
            const arr2 = [1, 2, 4];
            expect(compareArray(arr1, arr2)).toBe(false);
        })

        it('should return false for deeply nested arrays with differences', () => {
            const arr1 = [1, [2, [3, 4]], 5];
            const arr2 = [1, [2, [3, 5]], 5];
            expect(compareArray(arr1, arr2)).toBe(false);
        })

        it('should return true for deeply identical nested arrays', () => {
            const arr1 = [1, [2, [3, 4]], 5];
            const arr2 = [1, [2, [3, 4]], 5];
            expect(compareArray(arr1, arr2)).toBe(true);
        })

        it('should handle arrays with mixed types correctly', () => {
            const arr1 = [1, "hello", [true, null], { key: "value" }];
            const arr2 = [1, "hello", [true, null], { key: "value" }];
            expect(compareArray(arr1, arr2)).toBe(true);
        })
    })

    describe('range()', () => {
        it('should generate a range of numbers starting from 0', () => {
            expect(range(5)).toEqual([0, 1, 2, 3, 4]);
        })

        it('should generate a range of numbers starting from a specific number', () => {
            expect(range(5, 10)).toEqual([10, 11, 12, 13, 14]);
        })

        it('should generate a range of numbers with a specific step', () => {
            expect(range(5, 0, 2)).toEqual([0, 2, 4, 6, 8]);
        })

        it('should generate a descending range of numbers with a negative step', () => {
            expect(range(5, 10, -2)).toEqual([10, 8, 6, 4, 2]);
        })

        it('should generate a range of characters starting from a given character', () => {
            expect(range(5, 'A')).toEqual(['A', 'B', 'C', 'D', 'E']);
        })

        it('should generate a range of characters with a specific step', () => {
            expect(range(5, 'a', 2)).toEqual(['a', 'c', 'e', 'g', 'i']);
        })

        it('should generate a descending range of characters with a negative step', () => {
            expect(range(5, 'E', -1)).toEqual(['E', 'D', 'C', 'B', 'A']);
        })

        it('should use the first character of a string when startAt is multiple characters', () => {
            expect(range(5, 'hello')).toEqual(['h', 'i', 'j', 'k', 'l']);
        })

        it('should return an empty array if size is less than 1', () => {
            expect(range(0)).toEqual([]);
        })

        it('should return an empty array if step is 0', () => {
            expect(range(5, 0, 0)).toEqual([]);
        })

        it('should return an empty array if startAt is not a string or integer', () => {
            expect(range(5, [])).toEqual([]);
            expect(range(5, {})).toEqual([]);
            expect(range(5, null)).toEqual([]);
        })

        it('should generate a single-element range if size is 1', () => {
            expect(range(1, 5)).toEqual([5]);
            expect(range(1, 'A')).toEqual(['A']);
        })
    })

    describe('arrayUnique()', () => {
        it('should return an array with unique values', () => {
            const arr = [1, 2, 2, 3, 4, 4, 5];
            expect(arrayUnique(arr)).toEqual([1, 2, 3, 4, 5]);
        })

        it('should handle an empty array', () => {
            const arr = [];
            expect(arrayUnique(arr)).toEqual([]);
        })

        it('should handle an array with all unique values', () => {
            const arr = [1, 2, 3, 4, 5];
            expect(arrayUnique(arr)).toEqual([1, 2, 3, 4, 5]);
        })

        it('should handle an array with all duplicate values', () => {
            const arr = [1, 1, 1, 1];
            expect(arrayUnique(arr)).toEqual([1]);
        })

        it('should handle an array with mixed types', () => {
            const arr = [1, '1', 1, true, true, false, 'true'];
            expect(arrayUnique(arr)).toEqual([1, '1', true, false, 'true']);
        })

        it('should handle an array with nested arrays or objects', () => {
            const arr = [[1], [1], { a: 1 }, { a: 1 }];
            expect(arrayUnique(arr)).toEqual([[1], [1], { a: 1 }, { a: 1 }]); // Objects and arrays are not strictly equal
        })

        it('should preserve the order of the first occurrence of elements', () => {
            const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
            expect(arrayUnique(arr)).toEqual([3, 1, 4, 5, 9, 2, 6]);
        })
    })

    describe('arrayDiff()', () => {
        it('should return the difference of two arrays', () => {
            const array1 = [1, 2, 3, 4];
            const array2 = [2, 4];
            expect(arrayDiff(array1, array2)).toEqual([1, 3]);
        })

        it('should return the original array if there is no overlap', () => {
            const array1 = [1, 2, 3];
            const array2 = [4, 5, 6];
            expect(arrayDiff(array1, array2)).toEqual([1, 2, 3]);
        })

        it('should return an empty array if the first array is empty', () => {
            const array1 = [];
            const array2 = [1, 2, 3];
            expect(arrayDiff(array1, array2)).toEqual([]);
        })

        it('should return the first array if the second array is empty', () => {
            const array1 = [1, 2, 3];
            const array2 = [];
            expect(arrayDiff(array1, array2)).toEqual([1, 2, 3]);
        })

        it('should handle arrays with mixed types with strict mode', () => {
            const array1 = [1, '1', true, null];
            const array2 = [true, null];
            expect(arrayDiff(array1, array2, true)).toEqual([1, '1']);
        })

        it('should handle arrays with nested arrays or objects', () => {
            const array1 = [[1], { a: 1 }, 3];
            const array2 = [{ a: 1 }];
            expect(arrayDiff(array1, array2)).toEqual([[1], 3]);
        })

        it('should return an empty array if both arrays are empty', () => {
            const array1 = [];
            const array2 = [];
            expect(arrayDiff(array1, array2)).toEqual([]);
        })
    })
})
