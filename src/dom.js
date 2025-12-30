import {isObject, isPlainObject, isString} from "./is.js";
import {camelCase} from "./string.js";
import {each} from "./traversal.js";
import {compareArray} from "./array.js";

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
     * @param {Element|Document|string} refEl
     * @param {string} [selector='*']
     * @returns {NodeList}
     */
    find(refEl, selector = '*') {
        if (isString(refEl)) {
            selector = refEl;
            refEl = document;
        }

        try {
            return refEl.querySelectorAll(selector);
        } catch(e) {
            return document.querySelectorAll(':not(*)');
        }
    },

    /**
     * @param {Element|Document|string} refEl
     * @param {string} [selector='*']
     * @returns {Element|null}
     */
    findOne(refEl, selector = '*') {
        if (isString(refEl)) {
            selector = refEl;
            refEl = document;
        }

        try {
            return refEl.querySelector(selector);
        } catch (e) {
            return null;
        }
    },

    /**
     * @param {Element} el
     * @param {string} className
     * @returns {Element}
     */
    addClass(el, className) {
        if (!className) return el;

        const classNames = className.split(' ')
            .map(c => c.trim())
            .filter(Boolean);

        el.classList.add(...classNames);

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} classNames
     * @returns {Element}
     */
    removeClass(el, classNames) {
        if (!classNames) return el;

        el.classList.remove(...classNames.split(' ')
            .map(c => c.trim())
            .filter(Boolean));

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} classNames
     * @param {boolean} [force]
     * @returns {Element}
     */
    toggleClass(el, classNames, force) {
        each(
            classNames.split(' ')
                .map(c => c.trim())
                .filter(Boolean),
            (i, c) => el.classList.toggle(c, force)
        )

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} classNames
     * @returns {boolean}
     */
    hasClass(el, classNames) {
        return compareArray(
            [...el.classList],
            classNames.split(' ')
                .map(c => c.trim())
                .filter(Boolean),
        );
    },

    /**
     * @param {Element} el
     * @param {Element} child
     * @returns {Element}
     */
    append(el, child) {
        el.append(child);
        return el;
    },

    /**
     * @param {Element} el
     * @param {Element} child
     * @returns {Element}
     */
    prepend(el, child) {
        el.prepend(child);
        return el;
    },

    /**
     * @param {Element} el
     * @returns {void}
     */
    remove(el) {
        el.remove();
    },

    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element|null}
     */
    closest(el, selector) {
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

        return sibling;
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
     * @returns {Element}
     */
    data(el, name, value) {
        if (isPlainObject(name)) {
            each(name, (k, v) => this.data(el, k, v));
            return el;
        }

        const isAttr = /^data-/.test(name + '');
        const key = camelCase(isAttr ? (name + '').replace(/^data-/, '') : name + '');

        if (undefined === value) return el.dataset[key];

        if (null === value) this.removeData(el, key);

        el.dataset[key] = value;

        return el;
    },

    /**
     * @param {Element} el
     * @param {string} name
     * @returns {Element|*}
     */
    removeData(el, name) {
        const key = (name + '').replace(/^data-/, '').camelCase();

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
     * @param {Object<string, string>|string} styles
     * @param {string} [value]
     * @returns {Element}
     */
    css(el, styles, value) {
        if (isString(styles)) {
            if (undefined === value) {
                return styles.startsWith('--')
                    ? el.style.getPropertyValue(styles)
                    : el.style[styles];
            }

            if (styles.startsWith('--')) {
                el.style.setProperty(styles, String(value));
            } else {
                el.style[styles] = value;
            }

            return el;
        }

        each(styles, (name, v) => {
            if (name.startsWith('--')) {
                el.style.setProperty(name, String(v));
            } else {
                el.style[name] = v;
            }
        });

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
     * @param {NodeList} nodeList
     * @returns {Element|null}
     */
    last(nodeList) {
        return nodeList.length ? nodeList.item(nodeList.length - 1) : null;
    },

    /**
     * @param {string} html
     * @returns {Element}
     */
    create(html) {
        const tpl = document.createElement('template');
        tpl.innerHTML = html.trim();
        return tpl.content.firstElementChild;
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
    }
}
