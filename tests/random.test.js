import * as r from '../src/random.js';

describe('Random String Generation Functions', () => {
    const isAlpha = /^[a-z]+$/;
    const isAlphaCs = /^[a-zA-Z]+$/;
    const isAlphaNum = /^[a-z0-9]+$/;
    const isAlphaNumCs = /^[a-zA-Z0-9]+$/;
    const isNum = /^[0-9]+$/;

    it('should generate a unique ID of length 10 with uniqid', () => {
        const id = r.uniqid();
        expect(id).toHaveLength(10);
        expect(isAlpha.test(id)).toBe(true);
    });

    it('should generate a random lowercase alphabetic string with randAlpha', () => {
        const str = r.randAlpha(15);
        expect(str).toHaveLength(15);
        expect(isAlpha.test(str)).toBe(true);
    });

    it('should generate a random alphabetic string with uppercase and lowercase with randAlphaCs', () => {
        const str = r.randAlphaCs(12);
        expect(str).toHaveLength(12);
        expect(isAlphaCs.test(str)).toBe(true);
    });

    it('should generate a random alphanumeric string with lowercase letters and numbers with randAlphaNum', () => {
        const str = r.randAlphaNum(20);
        expect(str).toHaveLength(20);
        expect(isAlphaNum.test(str)).toBe(true);
    });

    it('should generate a random alphanumeric string with uppercase, lowercase letters, and numbers with randAlphaNumCs', () => {
        const str = r.randAlphaNumCs(25);
        expect(str).toHaveLength(25);
        expect(isAlphaNumCs.test(str)).toBe(true);
    });

    it('should generate a random numeric string with randNum', () => {
        const str = r.randNum(8);
        expect(str).toHaveLength(8);
        expect(isNum.test(str)).toBe(true);
    });

    it('should generate a random string from a custom range with rand', () => {
        const range = ['A', 'B', 'C', '1', '2', '3'];
        const str = r.rand(range, 6);
        expect(str).toHaveLength(6);
        [...str].forEach((char) => {
            expect(range).toContain(char);
        });
    });

    it('should handle zero length input for all functions', () => {
        expect(r.randAlpha(0)).toHaveLength(0);
        expect(r.randAlphaCs(0)).toHaveLength(0);
        expect(r.randAlphaNum(0)).toHaveLength(0);
        expect(r.randAlphaNumCs(0)).toHaveLength(0);
        expect(r.randNum(0)).toHaveLength(0);
        expect(r.rand(['X', 'Y', 'Z'], 0)).toHaveLength(0);
    });

    it('should return an empty string if n is negative for all functions', () => {
        expect(r.randAlpha(-5)).toHaveLength(0);
        expect(r.randAlphaCs(-5)).toHaveLength(0);
        expect(r.randAlphaNum(-5)).toHaveLength(0);
        expect(r.randAlphaNumCs(-5)).toHaveLength(0);
        expect(r.randNum(-5)).toHaveLength(0);
        expect(r.rand(['A', 'B', 'C'], -5)).toHaveLength(0);
    });
});
