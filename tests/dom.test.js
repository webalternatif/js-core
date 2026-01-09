import dom, {isWindow, isDocument, isDomElement, getStyle} from "../src/dom.js";

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

    describe('isDocument()', () => {
        it('should returns true for document object', () => {
            expect(isDocument(document)).toBe(true);
        });

        it('should return false for a DOM element', () => {
            const div = document.createElement('div');
            expect(isDocument(div)).toBe(false);
        });

        it('should return false for primitives', () => {
            expect(isDocument(123)).toBe(false);
            expect(isDocument(null)).toBe(false);
            expect(isDocument('string')).toBe(false);
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
            expect(dom.find(el, '.grandchild')).toHaveLength(9);
            expect(dom.find('.grandchild')).toHaveLength(9);
        })

        it('should return an empty list on invalid selector', () => {
            expect(dom.find(el, '!!!').length).toBe(0);
        })
    })

    describe('findOne()', () => {
        it('should return first descendant of element matching selector', () => {
            const child = el.children[0];
            const grandChild = child.children[0];

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

    describe('hasClass()', () => {
        it('should return true if element has all classes', () => {
            const child = el.children[0];
            expect(dom.hasClass(child, 'child child0')).toBe(true);
            expect(dom.hasClass(child, 'notexists')).toBe(false);
        })

        it('should handle empty string', () => {
            expect(dom.hasClass(el, '')).toBe(false);
        })
    })

    describe('append()', () => {
        it('should append a child to an element', () => {
            const div = document.createElement('div');

            dom.append(el, div);
            expect(el.lastElementChild).toBe(div);
        })

        it('should append multiple children', () => {
            const c1 = document.createElement('span');
            const c2 = document.createElement('span');

            dom.append(el, c1, c2);

            expect(el.children).toHaveLength(5);
            expect(el.lastElementChild).toBe(c2);
        });
    })

    describe('prepend()', () => {
        it('should prepend a child to an element', () => {
            const div = document.createElement('div');

            dom.prepend(el, div);
            expect(el.firstElementChild).toBe(div);
        })

        it('should prepend multiple children', () => {
            const c1 = document.createElement('span');
            const c2 = document.createElement('span');

            dom.prepend(el, c1, c2);

            expect(el.children).toHaveLength(5);
            expect(el.firstElementChild).toBe(c1);
            expect(el.firstElementChild.nextElementSibling).toBe(c2);
        });

        it('should accept children as HTML string', () => {
            const c1 = '<span class="c1">';
            const c2 = '<span class="c2">';

            dom.prepend(el, c1, c2);

            expect(el.children).toHaveLength(5);
            expect(el.firstElementChild).toHaveClass('c1');
            expect(el.firstElementChild.nextElementSibling).toHaveClass('c2');
        });
    })

    describe('remove()', () => {
        it('should remove an element', () => {
            const child = el.children[0];

            dom.remove(child);
            expect(el.children).toHaveLength(2);
        })

        it('should remove multiple elements', () => {
            const child1 = el.children[0];
            const child2 = el.children[1];

            dom.remove(el, child1, child2);

            expect(el.children).toHaveLength(1);
        });
    })

    describe('closest()', () => {
        it('should return the closest element', () => {
            const child = el.children[0];
            const grandchild = child.children[0];

            expect(dom.closest(grandchild, '#root')).toBe(el);
            expect(dom.closest(grandchild, '.grandchild')).toBe(grandchild);
            expect(dom.closest(grandchild)).toBe(grandchild);
        })
    })

    describe('next()', () => {
        it('should return the immediate next element matching selector', () => {
            const child = el.children[0];

            expect(dom.next(child)).toBe(el.children[1]);
            expect(dom.next(child, '.child1')).toBe(el.children[1]);
            expect(dom.next(child, '.child2')).toBeNull();
        })

        it('should return null if there is no next element', () => {
            const child1 = el.children[0];
            const child3 = el.children[2];

            expect(dom.next(child3)).toBe(null);
            expect(dom.next(child1, '.notexists')).toBe(null);
        })
    })

    describe('prev()', () => {
        it('should return the immediate previous element matching selector', () => {
            const child = el.children[2];

            expect(dom.prev(child)).toBe(el.children[1]);
            expect(dom.prev(child, '.child0')).toBeNull();
        })

        it('should return null if there is no previous element', () => {
            const child1 = el.children[0];
            const child3 = el.children[2];

            expect(dom.prev(child1)).toBe(null);
            expect(dom.prev(child3, '.notexists')).toBe(null);
        })
    })

    describe('nextAll()', () => {
        it('should return every elements next to an element', () => {
            const child = el.children[0];

            expect(dom.nextAll(child)).toHaveLength(2);
            expect(dom.nextAll(child, '.child')).toHaveLength(2);
            expect(dom.nextAll(child, '.child2')).toHaveLength(1);
        })

        it('should return an empty list if there is no next element', () => {
            const child1 = el.children[0];
            const child3 = el.children[2];

            expect(dom.nextAll(child3)).toHaveLength(0);
            expect(dom.nextAll(child1, '.notexists')).toHaveLength(0);
        })
    })

    describe('prevAll()', () => {
        it('should return every elements previous to an element', () => {
            const child3 = el.children[2];

            expect(dom.prevAll(child3)).toHaveLength(2);
            expect(dom.prevAll(child3, '.child')).toHaveLength(2);
            expect(dom.prevAll(child3, '.child1')).toHaveLength(1);
        })

        it('should return an empty list if there is no previous element', () => {
            const child1 = el.children[0];
            const child3 = el.children[2];

            expect(dom.prevAll(child1)).toHaveLength(0);
            expect(dom.prevAll(child3, '.notexists')).toHaveLength(0);
        })
    })

    describe('wrap()', () => {
    })

    describe('attr()', () => {
    })

    describe('prop()', () => {
    })

    describe('html()', () => {
    })

    describe('text()', () => {
    })

    describe('hide()', () => {
    })

    describe('show()', () => {
    })

    describe('toggle()', () => {
    })

    describe('data()', () => {
    })

    describe('removeData()', () => {
    })

    describe('on(), off()', () => {
        it('should attach an event listener', () => {
            const handler = jest.fn();

            dom.on(el, 'click', handler);

            el.dispatchEvent(new MouseEvent('click'));

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(expect.any(MouseEvent));
        });

        it('should detach an event listener', () => {
            const handler = jest.fn();

            dom.on(el, 'click', handler);
            dom.off(el, 'click', handler);

            el.dispatchEvent(new MouseEvent('click'));

            expect(handler).not.toHaveBeenCalled();
        });

        it('should support multiple events', () => {
            const handler = jest.fn();

            dom.on(el, 'click mouseenter', handler);

            el.dispatchEvent(new MouseEvent('click'));
            el.dispatchEvent(new MouseEvent('mouseenter'));

            expect(handler).toHaveBeenCalledTimes(2);
        });

        it('should remove handler for multiple events', () => {
            const handler = jest.fn();

            dom.on(el, 'click mouseenter', handler);
            dom.off(el, 'click mouseenter', handler);

            el.dispatchEvent(new MouseEvent('click'));
            el.dispatchEvent(new MouseEvent('mouseenter'));

            expect(handler).not.toHaveBeenCalled();
        });

        it('should call handler when delegated target matches selector', () => {
            const handler = jest.fn();

            const child1 = el.querySelector('.child1');

            dom.on(el, 'click', '.child1', handler);

            child1.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(handler).toHaveBeenCalledTimes(1);

            const ev = handler.mock.calls[0][0];
            expect(ev.target).toBe(child1);
        });

        it('should not call handler when delegated target does not match selector', () => {
            const handler = jest.fn();

            const child2 = el.querySelector('.child2');

            dom.on(el, 'click', '.child1', handler);

            child2.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(handler).not.toHaveBeenCalled();
        });

        it('should match delegated selector on ancestors', () => {
            const handler = jest.fn();

            const deep = el.querySelector('.child1 .grandchild0');

            dom.on(el, 'click', '.child1', handler);

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(handler).toHaveBeenCalledTimes(1);
        });

        it('should set currentTarget to matched element', () => {
            const handler = jest.fn();

            const deep = el.querySelector('.child1 .grandchild0');
            const child1 = el.querySelector('.child1');

            dom.on(el, 'click', '.child1', handler);

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            const ev = handler.mock.calls[0][0];
            expect(ev.currentTarget).toBe(child1);
            expect(ev.originalEvent).toBeInstanceOf(MouseEvent);
        });

        it('should remove delegated handler only', () => {
            const h1 = jest.fn();
            const h2 = jest.fn();

            const deep = el.querySelector('.child1 .grandchild0');

            dom.on(el, 'click', '.child1', h1);
            dom.on(el, 'click', '.child1', h2);

            dom.off(el, 'click', '.child1', h1);

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(h1).not.toHaveBeenCalled();
            expect(h2).toHaveBeenCalledTimes(1);
        });

        it('should remove all delegated handlers for selector', () => {
            const h1 = jest.fn();
            const h2 = jest.fn();

            const deep = el.querySelector('.child1 .grandchild0');

            dom.on(el, 'click', '.child1', h1);
            dom.on(el, 'click', '.child1', h2);

            dom.off(el, 'click', '.child1');

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(h1).not.toHaveBeenCalled();
            expect(h2).not.toHaveBeenCalled();
        });

        it('should not remove direct handler when removing delegated one', () => {
            const direct = jest.fn();
            const delegated = jest.fn();

            const deep = el.querySelector('.child1 .grandchild0');

            dom.on(el, 'click', direct);
            dom.on(el, 'click', '.child1', delegated);

            dom.off(el, 'click', '.child1', delegated);

            deep.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(direct).toHaveBeenCalledTimes(1);
            expect(delegated).not.toHaveBeenCalled();
        });

        it('should be safe to call off multiple times', () => {
            const handler = jest.fn();

            dom.on(el, 'click', handler);
            dom.off(el, 'click', handler);
            dom.off(el, 'click', handler);
            dom.off(el, 'click');

            el.dispatchEvent(new MouseEvent('click'));

            expect(handler).not.toHaveBeenCalled();
        });

        it('should bind same handler twice', () => {
            const handler = jest.fn();

            dom.on(el, 'click', handler);
            dom.on(el, 'click', handler);

            el.dispatchEvent(new MouseEvent('click'));

            expect(handler).toHaveBeenCalledTimes(2);
        });

        it('should remove all occurrences of handler', () => {
            const handler = jest.fn();

            dom.on(el, 'click', handler);
            dom.on(el, 'click', handler);

            dom.off(el, 'click', handler);

            el.dispatchEvent(new MouseEvent('click'));

            expect(handler).not.toHaveBeenCalled();
        });

        it('should call handlers in registration order', () => {
            const calls = [];

            dom.on(el, 'click', () => calls.push(1));
            dom.on(el, 'click', () => calls.push(2));
            dom.on(el, 'click', () => calls.push(3));

            el.dispatchEvent(new MouseEvent('click'));

            expect(calls).toEqual([1, 2, 3]);
        });

        it('should remove only handlers for given event', () => {
            const click = jest.fn();
            const enter = jest.fn();

            dom.on(el, 'click', click);
            dom.on(el, 'mouseenter', enter);

            dom.off(el, 'click');

            el.dispatchEvent(new MouseEvent('click'));
            el.dispatchEvent(new MouseEvent('mouseenter'));

            expect(click).not.toHaveBeenCalled();
            expect(enter).toHaveBeenCalledTimes(1);
        });

        it('should remove all handlers when calling off(el)', () => {
            const h1 = jest.fn();
            const h2 = jest.fn();

            dom.on(el, 'click', h1);
            // dom.on(el, 'click', '.child1', h2);

            dom.off(el);

            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(h1).not.toHaveBeenCalled();
            // expect(h2).not.toHaveBeenCalled();
        });
    })

    describe('css()', () => {
    })

    describe('closestFind()', () => {
    })

    describe('closestFindOne()', () => {
    })

    describe('first()', () => {
    })

    describe('last()', () => {
    })

    describe('create()', () => {
    })

    describe('eq()', () => {
    })

    describe('after()', () => {
    })

    describe('before()', () => {
    })

    describe('empty()', () => {
    })
})





















