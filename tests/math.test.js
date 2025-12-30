import {
    min,
    max,
    round,
    hex2dec,
    dec2hex,
    floorTo,
    plancher
} from "../src/math.js";

describe('math functions', () => {
    describe('round()', () => {
        it('should round to the nearest integer when no precision is given', () => {
            expect(round(1.4)).toBe(1);
            expect(round(1.6)).toBe(2);
        });

        it('should round to the specified precision', () => {
            expect(round(1.234, 1)).toBe(1.2);
            expect(round(1.234, 2)).toBe(1.23);
            expect(round(1.235, 2)).toBe(1.24);
        });

        it('should handle negative precision', () => {
            expect(round(1234.56, -1)).toBe(1230);
            expect(round(1234.56, -2)).toBe(1200);
            expect(round(1234.56, -3)).toBe(1000);
        });

        it('should handle edge cases with 0 precision', () => {
            expect(round(0.5)).toBe(1);
            expect(round(-0.5)).toBe(-0);
            expect(round(0)).toBe(0);
        });

        it('should handle very large numbers', () => {
            expect(round(123456789.98765, 3)).toBe(123456789.988);
            expect(round(123456789.98765, -3)).toBe(123457000);
        });

        it('should handle negative numbers', () => {
            expect(round(-1.234, 1)).toBe(-1.2);
            expect(round(-1.234, 2)).toBe(-1.23);
            expect(round(-1.235, 2)).toBe(-1.24);
        });

        it('should handle edge cases with precision 0', () => {
            expect(round(1.5, 0)).toBe(2);
            expect(round(-1.5, 0)).toBe(-1);
        });

        it('should return the same value for integers', () => {
            expect(round(5)).toBe(5);
            expect(round(-5)).toBe(-5);
        });
    });

    describe('floorTo()', () => {
        it('should round down to the nearest multiple of the precision', () => {
            expect(floorTo(123, 10)).toBe(120);
            expect(floorTo(456, 100)).toBe(400);
            expect(floorTo(789.25, 0.1)).toBe(789.2);
        });

        it('should handle negative numbers correctly', () => {
            expect(floorTo(-123, 10)).toBe(-130);
            expect(floorTo(-456, 100)).toBe(-500);
            expect(floorTo(-789.25, 0.1)).toBe(-789.3);
        });

        it('should handle precision larger than the number', () => {
            expect(floorTo(50, 100)).toBe(0);
            expect(floorTo(-50, 100)).toBe(-100);
        });

        it('should return the number itself when precision is 1', () => {
            expect(floorTo(123, 1)).toBe(123);
            expect(floorTo(-456, 1)).toBe(-456);
        });

        it('should return 0 when the number is 0', () => {
            expect(floorTo(0, 10)).toBe(0);
            expect(floorTo(0, 100)).toBe(0);
        });

        it('should handle edge cases with very small precision', () => {
            expect(floorTo(123.456, 0.01)).toBe(123.45);
            expect(floorTo(-123.456, 0.01)).toBe(-123.46);
        });

        it('should throw an error if precision is 0', () => {
            expect(() => floorTo(123, 0)).toThrow();
        });

        it('should throw an error if precision is negative', () => {
            expect(() => floorTo(123, -10)).toThrow();
        });
    });

    describe('min()', () => {
        it('should return the minimum value from an array', () => {
            const list = [5, 2, 9, 1, 7];
            const result = min(list);
            expect(result).toBe(1);
        });

        it('should handle an empty array and return Infinity', () => {
            const list = [];
            const result = min(list);
            expect(result).toBe(Infinity);
        });

        it('should handle an object with a custom comparison function', () => {
            const list = { a: 5, b: 2, c: 9, d: 1, e: 7 };
            const cmp_func = (a, b) => a - b;
            const result = min(list, cmp_func);
            expect(result).toBe(1);
        });

        it('should handle an object without a custom comparison function', () => {
            const list = { a: 'z', b: 'b', c: 'm' };
            const result = min(list);
            expect(result).toBe('b');
        });

        it('should return undefined for an empty object', () => {
            const list = {};
            const result = min(list);
            expect(result).toBeUndefined();
        });

        it('should return undefined if neither array nor object is passed', () => {
            const list = null;
            const result = min(list);
            expect(result).toBeUndefined();
        });
    });

    describe('max()', () => {
        it('should return the maximum value from an array', () => {
            const list = [0, 1, 5, 2, 4, 9, 1, 7, 2];
            const result = max(list);
            expect(result).toBe(9);
        });

        it('should handle an empty array and return -Infinity', () => {
            const list = [];
            const result = max(list);
            expect(result).toBe(-Infinity);
        });

        it('should handle an object with a custom comparison function', () => {
            const list = { a: 5, b: 2, c: 9, d: 1, e: 7 };
            const cmp_func = (a, b) => b - a;
            const result = max(list, cmp_func);
            expect(result).toBe(9);
        });

        it('should handle an object without a custom comparison function', () => {
            const list = { a: 'z', b: 'b', c: 'm' };
            const result = max(list);
            expect(result).toBe('z');
        });

        it('should return undefined for an empty object', () => {
            const list = {};
            const result = max(list);
            expect(result).toBeUndefined();
        });

        it('should return undefined if neither array nor object is passed', () => {
            const list = null;
            const result = max(list);
            expect(result).toBeUndefined();
        });
    });

    describe('hex2dec function', () => {
        it('should convert a single-digit hexadecimal to decimal', () => {
            expect(hex2dec('A')).toBe(10);
            expect(hex2dec('F')).toBe(15);
            expect(hex2dec('0')).toBe(0);
        });

        it('should convert a multi-digit hexadecimal to decimal', () => {
            expect(hex2dec('1A')).toBe(26);
            expect(hex2dec('FF')).toBe(255);
            expect(hex2dec('100')).toBe(256);
            expect(hex2dec('ABC')).toBe(2748);
        });

        it('should handle lowercase hexadecimal inputs', () => {
            expect(hex2dec('a')).toBe(10);
            expect(hex2dec('ff')).toBe(255);
            expect(hex2dec('abc')).toBe(2748);
        });

        it('should handle mixed-case hexadecimal inputs', () => {
            expect(hex2dec('aBc')).toBe(2748);
            expect(hex2dec('Ff')).toBe(255);
        });

        it('should handle numeric strings as input', () => {
            expect(hex2dec('123')).toBe(291);
        });

        it('should return 0 for an empty string', () => {
            expect(hex2dec('')).toBe(0);
        });

        it('should handle non-string inputs by converting them to strings', () => {
            expect(hex2dec(123)).toBe(291);
            expect(hex2dec(0)).toBe(0);
        });

        it('should return 0 for invalid hexadecimal characters', () => {
            expect(hex2dec('G')).toBe(0);
            expect(hex2dec('123G')).toBe(0);
        });
    });
});
