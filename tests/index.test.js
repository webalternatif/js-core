import '../src/index.js';
import {isFunction} from "../src/is.js";

describe('index', () => {
    const origTrim = String.prototype.trim;

    describe('String.prototype extensions', () => {
        it('should add custom methods to String.prototype', () => {
            expect(isFunction(String.prototype.numberFormat)).toBe(true);
        });

        it('should call the original method if available and arguments match', () => {
            const origTrim = String.prototype.trim;

            String.prototype.trim = jest.fn(origTrim);

            const result = ' hello '.trim();
            expect(result).toBe('hello');
            expect(String.prototype.trim).toHaveBeenCalled();

            String.prototype.trim = origTrim;
        });

        it('should call the custom method if arguments do not match the original', () => {
            expect('!hello!'.trim('!')).toBe('hello');
        });
    });
})
