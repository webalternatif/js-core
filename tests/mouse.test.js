import Mouse from "../src/Mouse.js";
import * as is from "../src/is.js";

describe('Mouse', () => {
    beforeEach(() => {
        jest.spyOn(is, 'isTouchDevice').mockReturnValue(false);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('getPosition should return position relative to element', () => {
        const ev = {
            pageX: 150,
            pageY: 200,
            clientX: 150,
            clientY: 200
        };

        const element = document.createElement('div');
        element.getBoundingClientRect = jest.fn(() => ({
            left: 100,
            top: 50
        }));

        Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });

        const pos = Mouse.getPosition(ev, element);

        expect(pos).toEqual({ x: 50, y: 150 });
    });

    it('getPosition without element should returns raw page coords', () => {
        const ev = { pageX: 80, pageY: 40 };

        const pos = Mouse.getPosition(ev);

        expect(pos).toEqual({ x: 80, y: 40 });
    });

    it('getViewportPosition should return client coords', () => {
        const ev = { clientX: 33, clientY: 77 };

        const pos = Mouse.getViewportPosition(ev);

        expect(pos).toEqual({ x: 33, y: 77 });
    });

    it('getPosition should return client coords on touch device', () => {
        is.isTouchDevice.mockReturnValue(true);

        const ev1 = {
            changedTouches: [{
                pageX: 33,
                pageY: 77
            }]
        };

        const ev2 = {
            originalEvent: {
                touches: [{
                    pageX: 33,
                    pageY: 77
                }]
            }
        };

        const pos1 = Mouse.getPosition(ev1);
        const pos2 = Mouse.getPosition(ev2);

        expect(pos1).toEqual({ x: 33, y: 77 });
        expect(pos2).toEqual({ x: 33, y: 77 });
    });

    it('getElement should use elementFromPoint', () => {
        const fakeEl = document.createElement('span');

        Object.defineProperty(document, 'elementFromPoint', {
            value: jest.fn().mockReturnValue(fakeEl),
            configurable: true
        });

        const ev = { clientX: 10, clientY: 20 };

        const el = Mouse.getElement(ev);

        expect(document.elementFromPoint).toHaveBeenCalledWith(10, 20);
        expect(el).toBe(fakeEl);
    });
})
