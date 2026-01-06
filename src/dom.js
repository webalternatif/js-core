import {isArray, isArrayLike, isObject, isString} from "./is.js";
import {camelCase} from "./string.js";
import {each, foreach, map} from "./traversal.js";
import {inArray} from "./array.js";

const cssNumber = [
    'animationIterationCount',
    'aspectRatio',
    'borderImageSlice',
    'columnCount',
    'flexGrow',
    'flexShrink',
    'fontWeight',
    'gridArea',
    'gridColumn',
    'gridColumnEnd',
    'gridColumnStart',
    'gridRow',
    'gridRowEnd',
    'gridRowStart',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'scale',
    'widows',
    'zIndex',
    'zoom',
    'fillOpacity',
    'floodOpacity',
    'stopOpacity',
    'strokeMiterlimit',
    'strokeOpacity',
];

export const isWindow = function(o) {
    return !!o && o === o.window;
}

export const isDomElement = function(o) {
    return isObject(o) && o instanceof HTMLElement;
}

export const getStyle = function(elem, cssRule) {
    if (!isDomElement(elem)) {
        return '';
    }

    if (window.getComputedStyle) {
        const computedStyle = window.getComputedStyle(elem, null);

        return computedStyle.getPropertyValue(cssRule) || computedStyle[camelCase(cssRule)] || '';
    }

    return elem.style[camelCase(cssRule)] || '';
}

export default {
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {NodeList}
     */
    children(el, selector) {
        return selector
            ? this.find(el, `:scope > ${selector}`)
            : el.children;
    },

    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element|null}
     */
    child(el, selector) {
        return this.first(this.children(el, selector));
    },

    /**
     * @param {Element|Document} refEl
     * @param {string|Element|NodeList|Array<Element>} [selector]
     * @returns {Element|null}
     */
    findOne(refEl, selector) {
        return this.find(refEl, selector)[0] ?? null;
    },

    /**
     * @param {Element|Document} refEl
     * @param {string|Element|NodeList|Array<Element>} selector
     * @returns {Array<Element>}
     */
    find(refEl, selector) {
        if (undefined === selector) {
            selector = refEl;
            refEl = document;
        }

        if (selector instanceof Element) {
            selector = [selector];
        }

        if (isArrayLike(selector)) {
            return map(Array.from(selector), (i, el) => {
                if (el instanceof Element) {
                    return refEl === el || refEl.contains(el) ? el : null;
                }

                return null;
            })
        }

        return Array.from(refEl.querySelectorAll(selector));
    },

    /**
     * @param {Element|NodeList|Array<Element>} el
     * @param {string} className
     * @returns {Element|NodeList|Array<Element>}
     */
    addClass(el, className) {
        if (!className) return el;

        const classNames = className.split(' ')
            .map(c => c.trim())
            .filter(Boolean);

        const elements = (el instanceof Element)
            ? [el]
            : Array.from(el);

        elements.forEach(e => {
            if (e instanceof Element) {
                e.classList.add(...classNames);
            }
        })

        return el;
    },

    /**
     * @param {Element|NodeList|Array<Element>} el
     * @param {string} className
     * @returns {Element|NodeList|Array<Element>}
     */
    removeClass(el, className) {
        if (!className) return;

        const classNames = className.split(' ')
            .map(c => c.trim())
            .filter(Boolean);

        const elements = (el instanceof Element)
            ? [el]
            : Array.from(el);

        elements.forEach(e => {
            if (e instanceof Element) {
                e.classList.remove(...classNames);
            }
        })

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} classNames
     * @param {boolean} [force]
     * @returns {Element}
     */
    toggleClass(el, classNames, force) {
        foreach(
            classNames.split(' ')
                .map(c => c.trim())
                .filter(Boolean),
            c => el.classList.toggle(c, force)
        )

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} classNames
     * @returns {boolean}
     */
    hasClass(el, classNames) {
        if (!classNames) return false;

        let foundClasses = true;

        foreach(
            classNames.split(' ')
            .map(c => c.trim())
            .filter(Boolean),
            c => {
                if (el.classList.contains(c)) {
                    return true;
                }

                foundClasses = false;
                return false;
            }
        )

        return foundClasses;
    },

    /**
     * @param {Node} node
     * @param {...Node} children
     * @returns {Node}
     */
    append(node, ...children) {
        node.append(...children);
        return node;
    },

    /**
     * @param {Node} node
     * @param {...Node} children
     * @returns {Node}
     */
    prepend(node, ...children) {
        node.prepend(...children);
        return node;
    },

    /**
     * @param {Element|NodeList|Array<Element>|string} els
     * @returns {void}
     */
    remove(...els) {
        els.forEach(el => {
            if (el instanceof Element) {
                el.remove();
            } else if (el instanceof NodeList || isArray(el)) {
                Array.from(el).forEach(e => e.remove());
            } else {
                this.remove(this.find(el));
            }
        })
    },

    /**
     * @param {Element} el
     * @param {string|Element} selector
     * @returns {Element|null}
     */
    closest(el, selector) {
        if (selector instanceof Element) {
            if (el === selector) {
                return el;
            }

            let parentEl = el.parentElement;

            while (parentEl) {
                if (parentEl === selector) {
                    return parentEl;
                }

                parentEl = parentEl.parentElement;
            }

            return null;
        }

        return el.closest(selector);
    },

    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element|null}
     */
    next(el, selector = null) {
        let sibling = el.nextElementSibling;

        if (!selector) return sibling;

        if (sibling && sibling.matches(selector)) {
            return sibling;
        }

        return null;
    },

    /**
     * @param {Element} el
     * @param {string|null} [selector]
     * @returns {Element|null}
     */
    prev(el, selector = null) {
        let sibling = el.previousElementSibling;

        if (!selector) return sibling;

        if (sibling && sibling.matches(selector)) {
            return sibling;
        }

        return null;
    },

    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element[]}
     */
    nextAll(el, selector) {
        const siblings = [];

        let sibling = el.nextElementSibling;

        while (sibling) {
            if (undefined === selector || sibling.matches(selector)) {
                siblings.push(sibling);
            }

            sibling = sibling.nextElementSibling;
        }

        return siblings;
    },

    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element[]}
     */
    prevAll(el, selector) {
        const siblings = [];

        let sibling = el.previousElementSibling;

        while (sibling) {
            if (undefined === selector || sibling.matches(selector)) {
                siblings.push(sibling);
            }

            sibling = sibling.previousElementSibling;
        }

        return siblings;
    },

    /**
     * @param {Element} el
     * @param {Element|string} selector
     * @returns {Element[]}
     */
    nextUntil(el, selector) {
        let selectorIsElement = false;
        const list = [];

        if (selector instanceof Element) {
            selectorIsElement = true;
        }

        let nextSibling = el.nextElementSibling;

        while (nextSibling) {
            const found = selectorIsElement
                ? nextSibling === selector
                : nextSibling.matches(selector);

            if (found) break;

            list.push(nextSibling);

            nextSibling = nextSibling.nextElementSibling;
        }

        return list;
    },

    /**
     * @param {Element} el
     * @param {Element|string} selector
     * @returns {Element[]}
     */
    prevUntil(el, selector) {
        let selectorIsElement = false;
        const list = [];

        if (selector instanceof Element) {
            selectorIsElement = true;
        }

        let prevSibling = el.previousElementSibling;

        while (prevSibling) {
            const found = selectorIsElement
                ? prevSibling === selector
                : prevSibling.matches(selector);

            if (found) break;

            list.push(prevSibling);

            prevSibling = prevSibling.previousElementSibling;
        }

        return list;
    },

    /**
     * @param {Element} el
     * @param {Element} wrappingElement
     * @returns {Element}
     */
    wrap(el, wrappingElement) {
        if (!wrappingElement.isConnected) {
            el.parentNode.insertBefore(wrappingElement, el);
        }

        this.append(wrappingElement, el);

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} name
     * @param {*} [value]
     * @returns {Element|*}
     */
    attr(el, name, value) {
        if (undefined === value) return el.getAttribute(name);

        if (null === value) {
            el.removeAttribute(name);
        } else {
            el.setAttribute(name, value);
        }

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} name
     * @param {*} [value]
     * @returns {*|Element}
     */
    prop(el, name, value) {
        if (undefined === value) {
            return el[name];
        }

        el[name] = value;
        return el;
    },

    /**
     * @param {Element} el
     * @param {string} [html]
     * @returns {Element|*}
     */
    html(el, html) {
        if (undefined === html) return el.innerHTML;

        el.innerHTML = html;
        return el;
    },

    /**
     * @param {Element} el
     * @param {string} [text]
     * @returns {Element|*}
     */
    text(el, text) {
        if (undefined === text) return el.innerText;

        el.innerText = text;
        return el;
    },

    /**
     * @param {Element} el
     * @returns {Element}
     */
    hide(el) {
        if (undefined === this.data(el, '__display__')) {
            const display = getComputedStyle(el).display;
            this.data(el, '__display__', display);
        }

        el.style.display = 'none';
        return el;
    },

    /**
     * @param {Element} el
     * @returns {Element}
     */
    show(el) {
        const dataDisplay = this.data(el, '__display__')

        if (undefined === dataDisplay) {
            el.style.removeProperty('display');
        } else {
            el.style.display = dataDisplay;
            this.removeData(el, '__display__');
        }

        return el;
    },

    /**
     * @param {Element} el
     * @returns {Element}
     */
    toggle(el) {
        return 'none' === el.style.display ? this.show(el) : this.hide(el);
    },

    /**
     * @param {Element} el
     * @param {Object<string, string>|string} name
     * @param {string} [value]
     * @returns {Element|DOMStringMap}
     */
    data(el, name, value) {
        if (undefined === name && undefined === value) {
            return el.dataset;
        }

        if (webf.isPlainObject(name)) {
            webf.each(name, (k, v) => this.data(el, k, v));
            return el;
        }

        const isAttr = /^data-/.test(name + '');
        const key = camelCase(isAttr ? (name + '').replace(/^data-/, '') : name + '');

        if (undefined === value) return el.dataset[key];

        if (null === value) {
            this.removeData(el, key);
            return el;
        }

        el.dataset[key] = value;

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} name
     * @returns {Element|*}
     */
    removeData(el, name) {
        const key = camelCase((name + '').replace(/^data-/, ''));

        delete el.dataset[key];

        return el;
    },

    /**
     * @param {Element|Document|Window} el
     * @param {string} event
     * @param {function} handler
     * @param {AddEventListenerOptions|false} options
     * @returns {Element}
     */
    on(el, event, handler, options = false) {
        el.addEventListener(event, handler, options);
        return el;
    },

    /**
     * @param {Element|Document|Window} el
     * @param {string} event
     * @param {function} handler
     * @param {Object} options
     * @returns {Element}
     */
    off(el, event, handler, options) {
        el.removeEventListener(event, handler, options);
        return el;
    },

    /**
     * @param {HTMLElement} el
     * @param {Object<string, string>|string} style
     * @param {string} [value]
     * @returns {Element}
     */
    css(el, style, value) {
        if (isString(style)) {
            const prop = style.startsWith('--') ? style : camelCase(style);

            if (undefined === value) {
                return getStyle(el, prop);
            }

            if (prop.startsWith('--')) {
                el.style.setProperty(prop, String(value));
            } else {
                if (typeof value === "number" && !inArray(prop, cssNumber))
                    value += 'px';

                el.style[prop] = value;
            }
        } else {
            each(style, (name, v) => {
                this.css(el, name, v);
            });
        }

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} selectorClosest
     * @param {string} selectorFind
     * @returns {NodeList|null}
     */
    closestFind(el, selectorClosest, selectorFind) {
        const closest = this.closest(el, selectorClosest);

        if (closest) {
            return this.find(closest, selectorFind);
        }

        return null;
    },

    /**
     * @param {Element} el
     * @param {string} selectorClosest
     * @param {string} selectorFindOne
     * @returns {Element|null}
     */
    closestFindOne(el, selectorClosest, selectorFindOne) {
        const closest = this.closest(el, selectorClosest);

        if (closest) {
            return this.findOne(closest, selectorFindOne);
        }

        return null;
    },

    /**
     * @param {NodeList} nodeList
     * @returns {Element|null}
     */
    first(nodeList) {
        return nodeList?.length ? nodeList.item(0) : null;
    },

    /**
     * @param {NodeList|Array<Element>} nodeList
     * @returns {Element|null}
     */
    last(nodeList) {
        const arr = Array.from(nodeList)[0];
        return arr[arr.length - 1];
    },

    /**
     * @param {string} html
     * @returns {Element|null}
     */
    create(html) {
        const tpl = document.createElement('template');
        tpl.innerHTML = html.trim();
        return tpl.content.firstElementChild ?? null;
    },

    /**
     * @param {NodeList} nodeList
     * @param {number} [index=0]
     * @returns {Element|null}
     */
    eq(nodeList, index = 0) {
        if (Math.abs(index) >= nodeList.length) return null;

        if (index < 0) {
            index = nodeList.length + index;
        }

        return nodeList.item(index);
    },

    /**
     * @param {Element} el
     * @param {Element} newEl
     * @returns {Element}
     */
    after(el, newEl) {
        return el.parentElement.insertBefore(newEl, el.nextElementSibling);
    },

    /**
     * @param {Element} el
     * @param {Element} newEl
     * @returns {Element}
     */
    before(el, newEl) {
        return el.parentElement.insertBefore(newEl, el);
    },

    /**
     * @param {Element} el
     * @returns {Element}
     */
    empty(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }

        return el;
    },

    /**
     * @param {Element|NodeList} el
     * @param {string|Element} selector
     * @return {Element[]}
     */
    not(el, selector) {
        const elements = (el instanceof Element)
            ? [el]
            : Array.from(el);

        const selectorIsString = webf.isString(selector);

        return elements.filter(e => {
            if (!(e instanceof Element)) return false

            return selectorIsString
                ? !e.matches(selector)
                : e !== selector
        })
    }
}
