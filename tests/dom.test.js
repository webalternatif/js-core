import dom, {isWindow, isDomElement, getStyle} from "../src/dom.js";

describe('dom methods', () => {
    describe('isWindow()', () => {
        it('should returns true for window object', () => {
            expect(isWindow(window)).toBe(true);
        });

        it('should return false for a DOM element', () => {
            const div = document.createElement('div');
            expect(isWindow(div)).toBe(false);
        });

        it('should return false for primitives', () => {
            expect(isWindow(123)).toBe(false);
            expect(isWindow(null)).toBe(false);
            expect(isWindow('string')).toBe(false);
        });
    });

    describe('isDomElement()', () => {
        it('should return true for a DOM element', () => {
            const div = document.createElement('div');
            expect(isDomElement(div)).toBe(true);
        });

        it('should return false for non-DOM objects', () => {
            expect(isDomElement({})).toBe(false);
            expect(isDomElement(null)).toBe(false);
            expect(isDomElement(undefined)).toBe(false);
            expect(isDomElement(42)).toBe(false);
            expect(isDomElement('string')).toBe(false);
            expect(isDomElement({ nodeType: 1 })).toBe(false);
        });
    })

    describe('getStyle', () => {
        const mockElement = (styles = {}) => {
            const element = document.createElement('div');
            Object.assign(element.style, styles);
            return element;
        };

        const mockNonDomElement = () => ({});

        it('should return empty string for non-DOM elements', () => {
            const nonDomElement = mockNonDomElement();
            expect(getStyle(nonDomElement, 'color')).toBe('');
        });

        it('should return the computed style for a valid DOM element', () => {
            const elem = mockElement({color: 'red'});
            document.body.appendChild(elem);

            expect(getStyle(elem, 'color')).toBe('red');
            document.body.removeChild(elem);
        });

        it('should return inline style when no computed style is available', () => {
            const elem = mockElement({ backgroundColor: 'blue' });
            expect(getStyle(elem, 'background-color')).toBe('blue');
        });

        it('should return camelCase style for kebab-case properties', () => {
            const elem = mockElement({ backgroundColor: 'green' });
            expect(getStyle(elem, 'background-color')).toBe('green');
        });

        it('should return empty string for undefined styles', () => {
            const elem = mockElement();
            expect(getStyle(elem, 'color')).toBe('');
        });

        it('should return empty string for invalid cssRule', () => {
            const elem = mockElement({ color: 'red' });
            expect(getStyle(elem, 'invalid-rule')).toBe('');
        });

        it('should handle cases where getComputedStyle is unavailable', () => {
            const originalGetComputedStyle = window.getComputedStyle;
            delete window.getComputedStyle;

            const elem = mockElement({ color: 'blue' });
            expect(getStyle(elem, 'color')).toBe('blue');
            expect(getStyle(elem, 'notexists')).toBe('');

            window.getComputedStyle = originalGetComputedStyle;
        });
    });
});

describe('dom manipulation', () => {
    /** @type {HTMLDivElement} */
    let el;

    beforeEach(() => {
        el = document.createElement('div');
        el.id = 'root';

        for (let i = 0; i < 3; i++) {
            const child = document.createElement('div');
            child.classList.add('child');
            child.classList.add(`child${i}`);
            el.append(child);

            for (let j = 0; j < 3; j++) {
                const grandchild = document.createElement('div');
                grandchild.classList.add('grandchild');
                grandchild.classList.add(`grandchild${j}`);
                child.append(grandchild);
            }
        }

        document.body.append(el);
    })

    afterEach(() => document.body.innerHTML = '');

    describe('children()', () => {
        it('should return children of element', () => {
            expect(dom.children(el).length).toBe(3);
            expect(dom.children(el, '.child1').length).toBe(1);
            expect(dom.children(el, '.notexists').length).toBe(0);
        });
    })

    describe('child()', () => {
        it('should return one child of element', () => {
            const firstChild = el.children[0];
            const secondChild = el.children[1];

            expect(dom.child(el)).toBe(firstChild);
            expect(dom.child(el, '.child1')).toBe(secondChild);
            expect(dom.child(el, '.notexists')).toBe(null);
        })
    })

    describe('find()', () => {
        it('should return descendants of element', () => {
            expect(dom.find(el).length).toBe(12);
            expect(dom.find(el, '.grandchild').length).toBe(9);
            expect(dom.find('.grandchild').length).toBe(9);
        })

        it('should return an empty list on invalid selector', () => {
            expect(dom.find(el, '!!!').length).toBe(0);
        })
    })

    describe('findOne()', () => {
        it('should return one descendant of element', () => {
            const child = el.children[0];
            const grandChild = child.children[0];

            expect(dom.findOne(el)).toBe(child);
            expect(dom.findOne(el, '.grandchild')).toBe(grandChild);
            expect(dom.findOne('.grandchild')).toBe(grandChild);
        })

        it('should return null on invalid selector', () => {
            expect(dom.findOne(el, '!!!')).toBe(null);
        })
    })

    describe('addClass()', () => {
        it('should add classes to element', () => {
            dom.addClass(el, 'perceval karadoc');

            expect(el.classList.contains('perceval')).toBe(true);
            expect(el.classList.contains('karadoc')).toBe(true);
        })

        it('should handle empty string', () => {
            const before = [...el.classList];
            dom.addClass(el, '');
            expect([...el.classList]).toEqual(before);
        })
    })

    describe('removeClass()', () => {
        it('should remove classes to element', () => {
            const child = el.children[0];
            dom.removeClass(child, 'child child1');

            expect(el.classList.contains('child')).toBe(false);
            expect(el.classList.contains('child1')).toBe(false);
        })

        it('should handle empty string', () => {
            el.classList.add('root');

            const before = [...el.classList];
            dom.removeClass(el, '');
            expect([...el.classList]).toEqual(before);
        })
    })

    describe('toggleClass()', () => {
        it('should toggle classes to element', () => {
            const child = el.children[0];

            dom.toggleClass(child, 'foo');
            expect(child.classList.contains('foo')).toBe(true);

            dom.toggleClass(child, 'foo child1');
            expect(child.classList.contains('foo')).toBe(false);
            expect(child.classList.contains('child1')).toBe(false);
        })

        it('should handle empty string', () => {
            el.classList.add('root');

            const before = [...el.classList];
            dom.toggleClass(el, '');
            expect([...el.classList]).toEqual(before);
        })
    })
})





















