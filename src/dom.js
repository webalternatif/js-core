import {
    isArray,
    isArrayLike,
    isDocument,
    isFunction,
    isPlainObject,
    isString,
    isWindow,
} from './is.js'
import { camelCase } from './string.js'
import { each, foreach, map } from './traversal.js'
import { inArray } from './array.js'
import { on, off, __resetCustomEventsForTests } from './onOff.js'

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
]

const dom = {
    /**
     * Returns the direct children of an element.
     * If a selector is provided, only children matching the selector are returned.
     *
     * @example
     * // <ul id="list"><li class="a"></li><li class="b"></li></ul>
     * const list = document.getElementById('list')
     *
     * dom.children(list) // [[<li class="a">], [<li class="b">]]
     * dom.children(list, '.a') // [<li class="a">]
     *
     * @param {Element} el - Parent element
     * @param {string} [selector] - Optional CSS selector to filter direct children
     * @returns {Element[]} Direct children, optionally filtered
     */
    children(el, selector) {
        return selector ? this.find(el, `:scope > ${selector}`) : Array.from(el.children)
    },

    /**
     * Returns the first direct child of an element matching `selector`.
     *
     * @example
     * // <ul id="list"><li class="a"></li><li class="b"></li></ul>
     * const list = document.getElementById('list')
     *
     * dom.child(list) // <li class="a">
     * dom.child(list, '.b') // <li class="b">
     * dom.child(list, '.c') // null
     *
     * @param {Element} el - Parent element
     * @param {string} [selector] - Optional CSS selector to filter direct children
     * @returns {Element|null} - The first matching direct child, or null if none found
     */
    child(el, selector) {
        return this.first(this.children(el, selector))
    },

    /**
     * Finds elements based on a selector or a collection
     *
     * If only one argument is provided, the search is performed from `document`.
     *
     * The `selector` can be:
     * - a CSS selector string
     * - a single Element
     * - a NodeList or array-like collection of Elements
     *
     * @example
     * dom.find('.item') // All elements matching .item in document
     *
     * const container = document.getElementById('box')
     * dom.find(container, '.item') // All .item inside #box
     *
     * const el = document.querySelector('.item')
     * dom.find(container, el) // [el] if inside container, otherwise []
     *
     * const list = document.querySelectorAll('.item')
     * dom.find(container, list) // Only those inside container
     *
     * @param {Element|Document|DocumentFragment|string} refEl - Reference element or selector (if used alone)
     * @param {string|Element|NodeList|Array<Element>} [selector] - What to find
     * @returns {Element[]} - An array of matched elements
     */
    find(refEl, selector) {
        if (undefined === selector) {
            selector = refEl
            refEl = document
        }

        if (selector instanceof Element) {
            selector = [selector]
        }

        if (isArrayLike(selector)) {
            return map(Array.from(selector), (i, el) => {
                if (el instanceof Element) {
                    return refEl === el || refEl.contains(el) ? el : null
                }

                return null
            })
        }

        try {
            return Array.from(refEl.querySelectorAll(selector))
        } catch {
            return []
        }
    },

    /**
     * Finds the first element matching a selector or collection.
     *
     * Behaves like `dom.find` but returns only the first matched element.
     * Returns `null` if no element matches.
     *
     * @param {Element|Document|DocumentFragment|string} refEl - Reference element or selector (if used alone)
     * @param {string|Element|NodeList|Array<Element>} [selector] - What to find
     * @returns {Element|null} - The first matched Element, or null if none found
     */
    findOne(refEl, selector) {
        return this.find(refEl, selector)[0] ?? null
    },

    /**
     * Finds elements by a data-* attribute.
     *
     * If `value` is provided, only elements with an exact matching value are returned.
     * If `value` is omitted, all elements having the data attribute are returned.
     *
     * @example
     * // <div data-user-id="42"></div>
     *
     * dom.findByData(document, 'user-id') // all elements with [data-user-id]
     * dom.findByData(document, 'user-id', '42') // elements with [data-user-id="42"]
     *
     * @param {Element|Document|string} el - Reference element or selector (if used alone)
     * @param {string} data - The data-* key without the "data-" prefix
     * @param {string} [value] - Optional value to match exactly
     * @returns {Element[]} - Matching elements
     */
    findByData(el, data, value) {
        if (undefined === value) return this.find(el, `[data-${data}]`)

        const escapeValue = CSS.escape(value + '')

        return this.find(el, `[data-${data}="${escapeValue}"]`)
    },

    /**
     * Finds the first element matching a data-* attribute.
     *
     * If `value` is provided, returns the first element whose data attribute
     * exactly matches the given value. If omitted, returns the first element
     * that has the data attribute.
     *
     * @example
     * // <div data-user-id="42"></div>
     *
     * dom.findOneByData(document, 'user-id') // first element with [data-user-id]
     * dom.findOneByData(document, 'user-id', '42') // element with [data-user-id="42"]
     * dom.findOneByData(document, 'user-id', '99') // null
     *
     * @param {Element|Document|string} el - Reference element or selector (if used alone)
     * @param {string} data - The data-* key without the "data-" prefix
     * @param {string} [value] - Optional value to match exactly
     * @returns {Element|null} The first matching element, or null if none found
     */
    findOneByData(el, data, value) {
        return this.findByData(el, data, value)[0] ?? null
    },

    /**
     * Adds one or more CSS classes to one or multiple elements.
     *
     * Multiple classes can be provided as a space-separated string.
     * Accepts a single Element, a NodeList, or an array of Elements.
     *
     * @example
     * const el = document.querySelector('#box')
     * dom.addClass(el, 'active')
     *
     * const items = document.querySelectorAll('.item')
     * dom.addClass(items, 'selected active')
     *
     * @param {Element|NodeList|Element[]} el - Element(s) to update
     * @param {string} className - One or more class names separated by spaces
     * @returns {Element|NodeList|Element[]} The original input
     */
    addClass(el, className) {
        if (!className) return el

        const classNames = className
            .split(' ')
            .map((c) => c.trim())
            .filter(Boolean)

        const elements = el instanceof Element ? [el] : Array.from(el)

        elements.forEach((e) => {
            if (e instanceof Element) {
                e.classList.add(...classNames)
            }
        })

        return el
    },

    /**
     * Removes one or more CSS classes from one or multiple elements.
     *
     * Multiple classes can be provided as a space-separated string.
     * Accepts a single Element, a NodeList, or an array of Elements.
     *
     * @example
     * const el = document.querySelector('#box')
     * dom.removeClass(el, 'active')
     *
     * const items = document.querySelectorAll('.item')
     * dom.removeClass(items, 'selected highlighted')
     *
     * @param {Element|NodeList|Array<Element>} el - Element(s) to update
     * @param {string} className - One or more class names separated by spaces
     * @returns {Element|NodeList|Array<Element>} The original input
     */
    removeClass(el, className) {
        if (!className) return el

        const classNames = className
            .split(' ')
            .map((c) => c.trim())
            .filter(Boolean)

        const elements = el instanceof Element ? [el] : Array.from(el)

        elements.forEach((e) => {
            if (e instanceof Element) {
                e.classList.remove(...classNames)
            }
        })

        return el
    },

    /**
     * Toggles one or more CSS classes on an element.
     *
     * Multiple classes can be provided as a space-separated string.
     * If `force` is provided, it explicitly adds (`true`) or removes (`false`)
     * the class instead of toggling it.
     *
     * @example
     * const el = document.querySelector('#box')
     *
     * dom.toggleClass(el, 'active')        // toggles "active"
     * dom.toggleClass(el, 'a b')           // toggles both classes
     * dom.toggleClass(el, 'active', true)  // ensures "active" is present
     * dom.toggleClass(el, 'active', false) // ensures "active" is removed
     *
     * @param {Element} el - Element to update
     * @param {string} classNames - One or more class names separated by spaces
     * @param {boolean} [force] - Optional force flag passed to classList.toggle
     * @returns {Element} The element
     */
    toggleClass(el, classNames, force) {
        foreach(
            classNames
                .split(' ')
                .map((c) => c.trim())
                .filter(Boolean),
            (c) => el.classList.toggle(c, force),
        )

        return el
    },

    /**
     * Checks whether an element has all the given CSS classes.
     *
     * Multiple classes can be provided as a space-separated string.
     * Returns `true` only if the element contains every class.
     *
     * @example
     * // <div class="box active large"></div>
     *
     * dom.hasClass(el, 'active') // true
     * dom.hasClass(el, 'active large') // true
     * dom.hasClass(el, 'active missing') // false
     * dom.hasClass(el, '') // false
     *
     * @param {Element} el - Element to test
     * @param {string} classNames - One or more class names separated by spaces
     * @returns {boolean} - `true` if the element has all the classes
     */
    hasClass(el, classNames) {
        if (!classNames) return false

        let foundClasses = true

        foreach(
            classNames
                .split(' ')
                .map((c) => c.trim())
                .filter(Boolean),
            (c) => {
                if (inArray(c, Array.from(el.classList))) return

                foundClasses = false
                return false
            },
        )

        return foundClasses
    },

    /**
     * Appends one or more children to a node.
     *
     * Children can be DOM nodes or HTML strings.
     *
     * @example
     * const box = document.createElement('div')
     * dom.append(box, document.createElement('span'))
     * dom.append(box, '<b>Hello</b>', '<i>world</i>')
     *
     * @param {Node} node - The parent node
     * @param {...(Node|string)} children - Nodes or HTML strings to append
     * @returns {Node} The parent node
     */
    append(node, ...children) {
        foreach(children, (child) => {
            if (isString(child)) {
                child = this.create(child)
            }

            child && node.append(child)
        })

        return node
    },

    /**
     * Prepends one or more children to a node.
     *
     * Children can be DOM nodes or HTML strings.
     * HTML strings are converted to nodes using `dom.create`.
     * When multiple children are provided, their original order is preserved.
     *
     * @example
     * const box = document.createElement('div')
     *
     * dom.prepend(box, document.createElement('span'))
     * dom.prepend(box, '<b>Hello</b>', '<i>world</i>')
     *
     * @param {Node} node - The parent node
     * @param {...(Node|string)} children - Nodes or HTML strings to prepend
     * @returns {Node} - The parent node
     */
    prepend(node, ...children) {
        foreach([...children].reverse(), (child) => {
            if (isString(child)) {
                child = this.create(child)
            }

            child && node.prepend(child)
        })

        return node
    },

    /**
     * @param {Element|NodeList|Element[]|string} els
     * @returns {void}
     */
    remove(...els) {
        els.forEach((el) => {
            if (el instanceof Element) {
                el.remove()
            } else if (el instanceof NodeList || isArray(el)) {
                Array.from(el).forEach((e) => e.remove())
            } else {
                this.remove(this.find(el))
            }
        })
    },

    /**
     * Returns the closest ancestor of an element matching a selector or a specific element.
     *
     * If a DOM element is provided as `selector`, the function walks up the DOM
     * tree and returns it if found among the ancestors (or the element itself).
     * If a CSS selector string is provided, it delegates to `Element.closest()`.
     * If `selector` is omitted, the element itself is returned.
     *
     * @example
     * const item = document.querySelector('.item')
     * const container = document.querySelector('.container')
     *
     * dom.closest(item, '.container') // container
     * dom.closest(item, container) // container
     * dom.closest(item) // item
     *
     * @param {Element} el - The starting element
     * @param {string|Element} [selector] - CSS selector or specific ancestor element
     * @returns {Element|null} - The matching ancestor, or null if none found
     */
    closest(el, selector) {
        if (selector instanceof Element) {
            if (el === selector) return el

            let parentEl = el.parentElement

            while (parentEl) {
                if (parentEl === selector) {
                    return parentEl
                }

                parentEl = parentEl.parentElement
            }

            return null
        }

        if (undefined === selector) {
            return el
        }

        return el.closest(selector)
    },

    /**
     * Returns the next sibling element of a node.
     *
     * If a selector is provided, the next sibling is returned only if it matches
     * the selector. This function does not search beyond the immediate sibling.
     *
     * @example
     * // <div class="a"></div><div class="b"></div><div class="c"></div>
     * const a = document.querySelector('.a')
     *
     * dom.next(a) // <div class="b">
     * dom.next(a, '.b') // <div class="b">
     * dom.next(a, '.c') // null
     *
     * @param {Element} el - Reference element
     * @param {string|null} [selector] - CSS selector to filter the sibling
     * @returns {Element|null} - The next sibling element, or null if not found/matching
     */
    next(el, selector = null) {
        let sibling = el.nextElementSibling

        if (!selector) return sibling

        if (sibling && sibling.matches(selector)) {
            return sibling
        }

        return null
    },

    /**
     * Returns the previous sibling element of a node.
     *
     * If a selector is provided, the previous sibling is returned only if it matches
     * the selector. This function does not search beyond the immediate sibling.
     *
     * @example
     * // <div class="a"></div><div class="b"></div><div class="c"></div>
     * const c = document.querySelector('.c')
     *
     * dom.prev(c) // <div class="b">
     * dom.prev(c, '.b') // <div class="b">
     * dom.prev(c, '.a') // null
     *
     * @param {Element} el - Reference element
     * @param {string|null} [selector] - CSS selector to filter the sibling
     * @returns {Element|null} - The previous sibling element, or null if not found/matching
     */
    prev(el, selector = null) {
        let sibling = el.previousElementSibling

        if (!selector) return sibling

        if (sibling && sibling.matches(selector)) {
            return sibling
        }

        return null
    },

    /**
     * Returns all following sibling elements of a node.
     *
     * If a selector is provided, only siblings matching the selector are included.
     * Traversal continues through all next siblings in document order.
     *
     * @example
     * // <div class="a"></div><div class="b"></div><div class="c"></div>
     * const a = document.querySelector('.a')
     *
     * dom.nextAll(a) // [<div class="b">, <div class="c">]
     * dom.nextAll(a, '.c') // [<div class="c">]
     *
     * @param {Element} el - Reference element
     * @param {string} [selector] - CSS selector to filter siblings
     * @returns {Element[]} - Array of matching following siblings
     */
    nextAll(el, selector) {
        const siblings = []

        let sibling = el.nextElementSibling

        while (sibling) {
            if (undefined === selector || sibling.matches(selector)) {
                siblings.push(sibling)
            }

            sibling = sibling.nextElementSibling
        }

        return siblings
    },

    /**
     * Returns all preceding sibling elements of a node.
     *
     * If a selector is provided, only siblings matching the selector are included.
     * Traversal continues through all previous siblings in reverse document order.
     *
     * @example
     * // <div class="a"></div><div class="b"></div><div class="c"></div>
     * const c = document.querySelector('.c')
     *
     * dom.prevAll(c) // [<div class="b">, <div class="a">]
     * dom.prevAll(c, '.a') // [<div class="a">]
     *
     * @param {Element} el - Reference element
     * @param {string} [selector] - CSS selector to filter siblings
     * @returns {Element[]} - Array of matching preceding siblings
     */
    prevAll(el, selector) {
        const siblings = []

        let sibling = el.previousElementSibling

        while (sibling) {
            if (undefined === selector || sibling.matches(selector)) {
                siblings.push(sibling)
            }

            sibling = sibling.previousElementSibling
        }

        return siblings
    },

    /**
     * Returns the index of a node among its preceding siblings.
     *
     * If a selector is provided, only matching siblings are considered.
     *
     * @example
     * // <div class="a"></div><div class="b"></div><div class="c"></div>
     * const c = document.querySelector('.c')
     *
     * dom.index(a) // 0
     * dom.index(c) // 2
     * dom.prevAll(c, '.a') // 1
     *
     * @param {Element} el - Reference element
     * @param {string} [selector] - CSS selector to filter siblings
     * @returns {number} - The index of `el`
     */
    index(el, selector) {
        return this.prevAll(el, selector).length
    },

    /**
     * Returns all following sibling elements until a matching element is reached.
     *
     * Traversal stops before the first sibling that matches the given selector
     * or equals the provided element. That matching element is not included.
     *
     * @example
     * // <div class="a"></div><div class="b"></div><div class="c"></div><div class="d"></div>
     * const a = document.querySelector('.a')
     * const d = document.querySelector('.d')
     *
     * dom.nextUntil(a, '.d') // [<div class="b">, <div class="c">]
     * dom.nextUntil(a, d)    // [<div class="b">, <div class="c">]
     *
     * @param {Element} el - Reference element
     * @param {Element|string} selector - CSS selector or element to stop at
     * @returns {Element[]} - Array of siblings until the stop condition
     */
    nextUntil(el, selector) {
        let selectorIsElement = false
        const list = []

        if (selector instanceof Element) {
            selectorIsElement = true
        }

        let nextSibling = el.nextElementSibling

        while (nextSibling) {
            const found = selectorIsElement
                ? nextSibling === selector
                : nextSibling.matches(selector)

            if (found) break

            list.push(nextSibling)

            nextSibling = nextSibling.nextElementSibling
        }

        return list
    },

    /**
     * Returns all preceding sibling elements until a matching element is reached.
     *
     * Traversal stops before the first sibling that matches the given selector
     * or equals the provided element. That matching element is not included.
     *
     * @example
     * // <div class="a"></div><div class="b"></div><div class="c"></div><div class="d"></div>
     *
     * const d = document.querySelector('.d')
     * const a = document.querySelector('.a')
     *
     * dom.prevUntil(d, '.a') // [<div class="c">, <div class="b">]
     * dom.prevUntil(d, a)    // [<div class="c">, <div class="b">]
     *
     * @param {Element} el - Reference element
     * @param {Element|string} selector - CSS selector or element to stop at
     * @returns {Element[]} - Array of siblings until the stop condition
     */
    prevUntil(el, selector) {
        let selectorIsElement = false
        const list = []

        if (selector instanceof Element) {
            selectorIsElement = true
        }

        let prevSibling = el.previousElementSibling

        while (prevSibling) {
            const found = selectorIsElement
                ? prevSibling === selector
                : prevSibling.matches(selector)

            if (found) break

            list.push(prevSibling)

            prevSibling = prevSibling.previousElementSibling
        }

        return list
    },

    /**
     * Wraps an element inside another element.
     *
     * If the wrapping element is not already in the DOM, it is inserted
     * just before the target element. The target element is then appended
     * inside the wrapper.
     *
     * @example
     * const el = document.querySelector('.item')
     * const wrapper = document.createElement('div')
     *
     * dom.wrap(el, wrapper)
     * // <div><div class="item"></div></div>
     *
     * @param {Element} el - The element to wrap
     * @param {Element} wrappingElement - The wrapper element
     * @returns {Element} - The original wrapped element
     */
    wrap(el, wrappingElement) {
        if (!wrappingElement.isConnected) {
            el.parentNode.insertBefore(wrappingElement, el)
        }

        this.append(wrappingElement, el)

        return el
    },

    /**
     * Gets, sets, or removes an attribute on an element.
     *
     * - If `value` is omitted, returns the attribute value (or null if not present).
     * - If `value` is `null`, the attribute is removed.
     * - Otherwise, the attribute is set to the provided value.
     *
     * @example
     * dom.attr(el, 'id') // "my-id"
     * dom.attr(el, 'title', 'Hello') // sets title="Hello"
     * dom.attr(el, 'disabled', null) // removes the attribute
     *
     * @param {Element} el - Target element
     * @param {string} name - Attribute name
     * @param {string|null} [value] - Value to set, or null to remove
     * @returns {Element|string|null} - The attribute value when reading, otherwise the element
     */
    attr(el, name, value) {
        if (undefined === value) return el.getAttribute(name)

        if (null === value) {
            el.removeAttribute(name)
        } else {
            el.setAttribute(name, value)
        }

        return el
    },

    /**
     * Gets or sets a property directly on a DOM element.
     *
     * Unlike `dom.attr`, this interacts with the live DOM property,
     * not the HTML attribute.
     *
     * - If `value` is omitted, returns the property value.
     * - Otherwise, sets the property.
     *
     * @example
     * dom.prop(input, 'checked') // true/false
     * dom.prop(input, 'checked', true) // checks the checkbox
     *
     * dom.prop(img, 'src') // full resolved URL
     *
     * @param {Element} el - Target element
     * @param {string} name - Property name
     * @param {any} [value] - Value to set
     * @returns {*|Element} - The property value when reading, otherwise the element
     */
    prop(el, name, value) {
        if (undefined === value) {
            return el[name]
        }

        el[name] = value
        return el
    },

    /**
     * Gets or sets the HTML content of an element.
     *
     * - If `html` is omitted, returns the element's current `innerHTML`.
     * - Otherwise, replaces the element's content with the provided HTML string.
     *
     * @example
     * dom.html(el) // "<span>Hello</span>"
     * dom.html(el, '<b>Hi</b>') // sets inner HTML
     *
     * @param {Element} el - Target element
     * @param {string} [html] - HTML string to set
     * @returns {Element|string} The HTML string when reading, otherwise the element
     */
    html(el, html) {
        if (undefined === html) return el.innerHTML

        el.innerHTML = html
        return el
    },

    /**
     * Gets or sets the text content of an element.
     *
     * - If `text` is omitted, returns the element's visible text (`innerText`).
     * - Otherwise, replaces the element's text content.
     *
     * @example
     * dom.text(el) // "Hello world"
     * dom.text(el, 'New text') // sets visible text content
     *
     * @param {Element} el - Target element
     * @param {string} [text] - Text to set
     * @returns {Element|string} - The text when reading, otherwise the element
     */
    text(el, text) {
        if (undefined === text) return el.innerText

        el.innerText = text
        return el
    },

    /**
     * Hides an element by setting `display: none`, while preserving its original display value.
     *
     * The original computed `display` value is stored internally so it can be
     * restored later (typically by the corresponding `show()` method).
     *
     * @example
     * dom.hide(el) // element becomes hidden
     *
     * @param {Element} el - Element to hide
     * @returns {Element} The element
     */
    hide(el) {
        if (undefined === this.data(el, '__display__')) {
            let display = ''

            if (isFunction(window.getComputedStyle)) {
                display = window.getComputedStyle(el).display
            } else {
                display = el.style.display
            }

            this.data(el, '__display__', display)
        }

        el.style.display = 'none'
        return el
    },

    /**
     * Shows an element by restoring its original `display` value.
     *
     * If the element was previously hidden using `hide`, its original
     * computed display value is restored. Otherwise, the inline `display`
     * style is simply removed.
     *
     * @example
     * dom.hide(el)
     * dom.show(el) // element becomes visible again with its original display
     *
     * @param {Element} el - Element to show
     * @returns {Element} - The element
     */
    show(el) {
        const dataDisplay = this.data(el, '__display__')

        if (undefined === dataDisplay) {
            el.style.removeProperty('display')
        } else {
            el.style.display = dataDisplay
            this.removeData(el, '__display__')
        }

        return el
    },

    /**
     * Toggles the visibility of an element using `dom.hide` and `dom.show`.
     *
     * The visibility state is determined from the computed display value,
     * not only the inline style.
     *
     * @example
     * dom.toggle(el) // hides if visible, shows if hidden
     *
     * @param {Element} el - Element to toggle
     * @returns {Element} - The element
     */
    toggle(el) {
        return 'none' === this.css(el, 'display') ? this.show(el) : this.hide(el)
    },

    /**
     * Gets, sets, or removes data-* attributes on an element.
     *
     * - If called with no arguments, returns the element's `dataset`.
     * - If `name` is an object, sets multiple data entries.
     * - If `value` is omitted, returns the value of the data key.
     * - If `value` is `null`, removes the data attribute.
     * - Otherwise, sets the data value.
     *
     * Keys can be provided in camelCase (`userId`) or kebab-case with `data-` prefix (`data-user-id`).
     *
     * @example
     * dom.data(el) // DOMStringMap of all data attributes
     *
     * dom.data(el, 'userId') // value of data-user-id
     * dom.data(el, 'userId', '42') // sets data-user-id="42"
     *
     * dom.data(el, 'data-role', 'admin') // also works
     *
     * dom.data(el, { userId: '42', role: 'admin' }) // sets multiple values
     *
     * dom.data(el, 'userId', null) // removes data-user-id
     *
     * @param {Element} el - Target element
     * @param {Object<string, string>|string} [name] - Data key or object of key/value pairs
     * @param {string|null} [value] - Value to set, or null to remove
     * @returns {Element|DOMStringMap|string|undefined} - Dataset, value, or element
     */
    data(el, name, value) {
        if (undefined === name && undefined === value) {
            return el.dataset
        }

        if (isPlainObject(name)) {
            each(name, (k, v) => this.data(el, k, v))
            return el
        }

        const isAttr = /^data-/.test(name + '')
        const key = camelCase(isAttr ? (name + '').replace(/^data-/, '') : name + '')

        if (undefined === value) return el.dataset[key]

        if (null === value) {
            delete el.dataset[key]

            return el
        }

        el.dataset[key] = value

        return el
    },

    /**
     * Removes a data-* attribute from an element.
     *
     * The key can be provided in camelCase, kebab-case, or with the `data-` prefix.
     *
     * @example
     * dom.removeData(el, 'userId')     // removes data-user-id
     * dom.removeData(el, 'user-id')    // removes data-user-id
     * dom.removeData(el, 'data-role')  // removes data-role
     *
     * @param {Element} el - Target element
     * @param {string} name - Data key to remove
     * @returns {Element} - The element
     */
    removeData(el, name) {
        return this.data(el, name, null)
    },

    /**
     * Gets or sets CSS styles on an element.
     *
     * - If `style` is a string and `value` is omitted, returns the computed style value.
     * - If `style` is a string and `value` is provided, sets the style.
     * - If `style` is an object, sets multiple styles at once.
     *
     * handles :
     * - camelCase and kebab-case properties
     * - CSS custom properties (`--var`)
     * - Adding `px` to numeric values where appropriate
     *
     * @example
     * dom.css(el, 'color') // "rgb(255, 0, 0)"
     * dom.css(el, 'background-color', 'blue')
     * dom.css(el, 'width', 200) // sets "200px"
     *
     * dom.css(el, {
     *   width: 100,
     *   height: 50,
     *   backgroundColor: 'red'
     * })
     *
     * dom.css(el, '--my-var', '10px') // CSS custom property
     *
     * @param {HTMLElement} el - Target element
     * @param {Object<string, string|number>|string} style - CSS property or object of properties
     * @param {string|number} [value] - Value to set
     * @returns {Element|string} - The style value when reading, otherwise the element
     */
    css(el, style, value) {
        if (isString(style)) {
            const prop = style.startsWith('--') ? style : camelCase(style)

            if (undefined === value) {
                if (window.getComputedStyle) {
                    const computedStyle = window.getComputedStyle(el, null)

                    return (
                        computedStyle.getPropertyValue(style) ||
                        computedStyle[camelCase(style)] ||
                        ''
                    )
                }

                return el.style[camelCase(style)] || ''
            }

            if (prop.startsWith('--')) {
                el.style.setProperty(prop, String(value))
            } else {
                if (typeof value === 'number' && !inArray(prop, cssNumber)) value += 'px'

                el.style[prop] = value
            }
        } else {
            each(style, (name, v) => {
                this.css(el, name, v)
            })
        }

        return el
    },

    /**
     * Finds elements matching a selector inside the closest ancestor
     * that matches another selector.
     *
     * First finds the closest ancestor of `el` matching `selectorClosest`,
     * then searches inside it for elements matching `selectorFind`.
     *
     * @example
     * // <div class="card"><button class="btn"></button><span class="label"></span></div>
     *
     * dom.closestFind(button, '.card', '.label')
     * // => finds .label inside the closest .card ancestor
     *
     * @param {Element} el - Starting element
     * @param {string} selectorClosest - Selector used to find the closest ancestor
     * @param {string} selectorFind - Selector used to find elements inside that ancestor
     * @returns {Element[]} - Array of matched elements, or empty array if none found
     */
    closestFind(el, selectorClosest, selectorFind) {
        const closest = this.closest(el, selectorClosest)

        if (closest) {
            return this.find(closest, selectorFind)
        }

        return []
    },

    /**
     * Finds the first element matching a selector inside the closest ancestor
     * that matches another selector.
     *
     * First finds the closest ancestor of `el` matching `selectorClosest`,
     * then searches inside it for the first element matching `selectorFindOne`.
     *
     * @example
     * // <div class="card"><button class="btn"></button><span class="label"></span></div>
     *
     * dom.closestFindOne(button, '.card', '.label')
     * // => finds the first .label inside the closest .card ancestor
     *
     * @param {Element} el - Starting element
     * @param {string} selectorClosest - Selector used to find the closest ancestor
     * @param {string} selectorFindOne - Selector used to find a single element inside that ancestor
     * @returns {Element|null} - The matched element, or null if none found
     */
    closestFindOne(el, selectorClosest, selectorFindOne) {
        const closest = this.closest(el, selectorClosest)

        if (closest) {
            return this.findOne(closest, selectorFindOne)
        }

        return null
    },

    /**
     * Returns the first element from a collection or the element itself.
     *
     * Accepts a single Element, a NodeList, or an array of Elements.
     * Returns `null` if the collection is empty.
     *
     * @example
     * dom.first(document.querySelectorAll('.item')) // first .item
     * dom.first([el1, el2]) // el1
     * dom.first(el) // el
     *
     * @param {NodeList|Element|Element[]} nodeList - Collection or single element
     * @returns {Element|null} - The first element, or null if none found
     */
    first(nodeList) {
        if (nodeList instanceof Element) return nodeList
        return Array.from(nodeList)[0] ?? null
    },

    /**
     * Returns the last element from a collection or the element itself.
     *
     * Accepts a NodeList or an array of Elements.
     * Returns `null` if the collection is empty.
     *
     * @example
     * dom.last(document.querySelectorAll('.item')) // last .item
     * dom.last([el1, el2]) // el2
     *
     * @param {NodeList|Element|Element[]} nodeList - Collection or single element
     * @returns {Element|null} - The last element, or null if none found
     */
    last(nodeList) {
        if (nodeList instanceof Element) return nodeList
        const arr = Array.from(nodeList)
        return arr[arr.length - 1] ?? null
    },

    /**
     * Creates DOM node(s) from a tag name or an HTML string.
     *
     * - If a simple tag name is provided (e.g. `"div"`), a new element is created.
     * - If an HTML string is provided, it is parsed using a `<template>` element.
     * - If the HTML contains a single root element, that element is returned.
     * - If multiple root nodes are present, a `DocumentFragment` is returned.
     *
     * @example
     * dom.create('div') // <div></div>
     * dom.create('<span>Hello</span>') // <span>Hello</span>
     * dom.create('<li>One</li><li>Two</li>') // DocumentFragment containing both <li>
     *
     * @param {string} html - Tag name or HTML string
     * @returns {Element|DocumentFragment|null} - Created node(s), or null if input is invalid
     */
    create(html) {
        if (!isString(html)) return null

        const isTagName = (s) => /^[A-Za-z][A-Za-z0-9-]*$/.test(s)

        if (isTagName(html)) {
            return document.createElement(html)
        }

        const tpl = document.createElement('template')
        tpl.innerHTML = html.trim()

        const frag = tpl.content

        if (frag.childElementCount === 1 && frag.children.length === 1) {
            return frag.firstElementChild
        }

        return frag.cloneNode(true)
    },

    /**
     * Returns the element at a given index from a collection.
     *
     * Supports negative indexes to count from the end of the list.
     * Returns `null` if the index is out of bounds.
     *
     * @example
     * const items = document.querySelectorAll('.item')
     *
     * dom.eq(items, 0)  // first element
     * dom.eq(items, 2)  // third element
     * dom.eq(items, -1) // last element
     * dom.eq(items, -2) // second to last
     *
     * @param {NodeList|Element[]} nodeList - Collection of elements
     * @param {number} [index=0] - Index of the element (can be negative)
     * @returns {Element|null} - The element at the given index, or null if not found
     */
    eq(nodeList, index = 0) {
        nodeList = Array.from(nodeList)

        if (Math.abs(index) >= nodeList.length) return null

        if (index < 0) {
            index = nodeList.length + index
        }

        return nodeList[index]
    },

    /**
     * Inserts a new element or HTML string immediately after a reference element.
     *
     * If `newEl` is a string, it is converted to a node using `dom.create`.
     * Returns the inserted node, or `null` if the reference element has no parent.
     *
     * @example
     * dom.after(el, '<span>New</span>')
     * dom.after(el, document.createElement('div'))
     *
     * @param {Element} el - Reference element
     * @param {Element|string} newEl - Element or HTML string to insert
     * @returns {Element|DocumentFragment|null} - The inserted node, or null if insertion failed
     */
    after(el, newEl) {
        if (!el.parentElement) return null

        if (isString(newEl)) {
            newEl = this.create(newEl)
        }

        return el.parentElement.insertBefore(newEl, el.nextElementSibling)
    },

    /**
     * Inserts a new element or HTML string immediately before a reference element.
     *
     * If `newEl` is a string, it is converted to a node using `dom.create`.
     * Returns the inserted node, or `null` if the reference element has no parent.
     *
     * @example
     * dom.before(el, '<span>New</span>')
     * dom.before(el, document.createElement('div'))
     *
     * @param {Element} el - Reference element
     * @param {Element|string} newEl - Element or HTML string to insert
     * @returns {Element|DocumentFragment|null} - The inserted node, or null if insertion failed
     */
    before(el, newEl) {
        if (!el.parentElement) return null

        if (isString(newEl)) {
            newEl = this.create(newEl)
        }

        return el.parentElement.insertBefore(newEl, el)
    },

    /**
     * Removes all child nodes from an element.
     *
     * @example
     * dom.empty(el) // el now has no children
     *
     * @param {Element} el - Element to clear
     * @returns {Element} - The element
     */
    empty(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild)
        }

        return el
    },

    /**
     * Filters a collection of elements by excluding those matching a selector
     * or a specific element.
     *
     * Accepts a single Element, a NodeList, or an array of Elements.
     * If `selector` is a string, elements matching it are excluded.
     * If `selector` is an Element, that exact element is excluded.
     *
     * @example
     * const items = document.querySelectorAll('.item')
     *
     * dom.not(items, '.active') // all .item elements except those with .active
     * dom.not(items, someElement) // all elements except that specific one
     *
     * dom.not(el, '.hidden') // returns [] if el matches, otherwise [el]
     *
     * @param {Element|NodeList|Element[]} el - Element(s) to filter
     * @param {string|Element} selector - CSS selector or element to exclude
     * @returns {Element[]} - Filtered array of elements
     */
    not(el, selector) {
        const elements = el instanceof Element ? [el] : Array.from(el)

        const selectorIsString = isString(selector)

        return elements.filter((e) => {
            return selectorIsString ? !e.matches(selector) : e !== selector
        })
    },

    /**
     * Checks whether two elements visually collide (overlap) in the viewport.
     *
     * Returns `true` if their rectangles intersect.
     *
     * @example
     * if (dom.collide(box1, box2)) {
     *   console.log('Elements overlap')
     * }
     *
     * @param {Element} elem1 - First element
     * @param {Element} elem2 - Second element
     * @returns {boolean} - `true` if the elements overlap, otherwise false
     */
    collide(elem1, elem2) {
        const rect1 = elem1.getBoundingClientRect()
        const rect2 = elem2.getBoundingClientRect()

        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        )
    },

    /**
     * Checks whether an element matches a selector or is equal to another element.
     *
     * If `selector` is a string, uses `Element.matches()`.
     * If `selector` is an Element, checks strict equality.
     *
     * @example
     * dom.matches(el, '.active') // true if el has class "active"
     * dom.matches(el, otherEl)   // true if el === otherEl
     *
     * @param {Element} el - Element to test
     * @param {string|Element} selector - CSS selector or element to compare
     * @returns {boolean} - `true` if the element matches, otherwise false
     */
    matches(el, selector) {
        if (!el) return false

        return selector instanceof Element ? selector === el : el.matches(selector)
    },

    /**
     * Replaces a child node of an element with another node.
     *
     * @example
     * dom.replaceChild(parent, newEl, oldEl)
     *
     * @param {Element} el - Parent element
     * @param {Element} child - New child node
     * @param {Element} oldChild - Existing child node to replace
     * @returns {Element} - The replaced node
     */
    replaceChild(el, child, oldChild) {
        return el.replaceChild(child, oldChild)
    },

    /**
     * Replaces all children of an element with new nodes or HTML strings.
     *
     * Strings are converted to DOM nodes using `dom.create`.
     *
     * @example
     * dom.replaceChildren(el, '<span>A</span>', '<span>B</span>')
     * dom.replaceChildren(el, document.createElement('div'))
     *
     * @param {Element} el - Target element
     * @param {...(Element|string)} children - New children to insert
     * @returns {Element} - The element
     */
    replaceChildren(el, ...children) {
        const nodes = []

        foreach(children, (child) => {
            if (isString(child)) {
                child = this.create(child)
            }

            nodes.push(child)
        })

        el.replaceChildren(...nodes)
        return el
    },

    /**
     * Returns the page offset of an element, document, or window.
     *
     * - For `window`, returns the current scroll position.
     * - For `document`, returns the scroll position of the root element.
     * - For an element, returns its position relative to the top-left of the page.
     *
     * @example
     * dom.offset(window)   // { top: scrollY, left: scrollX }
     * dom.offset(document) // { top: scrollTop, left: scrollLeft }
     * dom.offset(el)       // position of el relative to the page
     *
     * @param {Element|Document|Window} el - Target element, document, or window
     * @returns {{top: number, left: number}} - The offset relative to the page
     */
    offset(el) {
        if (isWindow(el)) {
            return {
                top: el.scrollY,
                left: el.scrollX,
            }
        } else if (isDocument(el)) {
            return {
                top: el.documentElement.scrollTop,
                left: el.documentElement.scrollLeft,
            }
        }

        const rect = el.getBoundingClientRect()
        const wOffset = this.offset(window)

        return {
            top: rect.top + wOffset.top,
            left: rect.left + wOffset.left,
        }
    },

    /**
     * Checks whether a node is inside an editable context.
     *
     * Returns true if the element itself, or one of its ancestors,
     * is an editable form control or has `contenteditable="true"`.
     * Text nodes are automatically resolved to their parent element.
     *
     * @example
     * dom.isEditable(inputEl) // true
     * dom.isEditable(textareaEl) // true
     * dom.isEditable(selectEl) // true
     *
     * dom.isEditable(divWithContentEditable) // true
     * dom.isEditable(spanInsideContentEditable) // true
     *
     * dom.isEditable(document.body) // false
     *
     * @param {Node} el - Node to test
     * @returns {boolean} True if the node is in an editable context
     */
    isEditable(el) {
        if (el?.nodeType === 3) el = el.parentElement

        if (!(el instanceof HTMLElement)) return false

        return (
            inArray(el.tagName, ['INPUT', 'TEXTAREA', 'SELECT']) ||
            el.isContentEditable ||
            !!this.closest(el, '[contenteditable="true"]')
        )
    },

    /**
     * Checks whether a node is currently attached to the main document.
     *
     * @example
     * dom.isInDOM(el) // true if element is in the document
     *
     * const frag = document.createDocumentFragment()
     * dom.isInDOM(frag) // false
     *
     * @param {Node} node - Node to test
     * @returns {boolean} - `true` if the node is attached to the document
     */
    isInDOM(node) {
        if (!(node instanceof Node)) return false

        const root = node.getRootNode({ composed: true })
        return root === document
    },

    /**
     * Attaches one or more event listeners to an element, document, or window.
     *
     * Supports:
     * - Multiple events (space-separated)
     * - Event namespaces (e.g. "click.menu")
     * - Event delegation via CSS selector
     * - Custom events
     *
     * Custom Events :
     *
     * The following custom events are available:
     *
     * `longtap`
     *   Fired when the user presses and holds on an element for a short duration
     *   (useful for touch interfaces and long-press interactions).
     *
     * `dbltap`
     *   Fired when the user performs a quick double tap on touch devices.
     *
     * These events are automatically enabled the first time they are used.
     *
     * @example
     * // Simple binding
     * dom.on(button, 'click', (ev) => {})
     *
     * // Multiple events
     * dom.on(input, 'focus blur', handler)
     *
     * // Namespaced event
     * dom.on(button, 'click.menu', handler)
     *
     * // Delegated event
     * dom.on(list, 'click', '.item', (ev) => {})
     *
     * // With options
     * dom.on(window, 'scroll', handler, { passive: true })
     *
     * @example
     * dom.on(el, 'longtap', handler)
     * dom.on(el, 'dbltap', handler)
     *
     * @param {Element|Document|Window} el - Element to bind the listener to
     * @param {string} events - Space-separated list of events (optionally namespaced)
     * @param {string|function} [selector] - CSS selector for delegation, or handler if no delegation
     * @param {function|AddEventListenerOptions|boolean} [handler] - Event handler
     * @param {AddEventListenerOptions|boolean} [options] - Native event listener options
     * @returns {Element} - The element
     */
    on,

    /**
     * Removes event listeners previously attached with `dom.on`.
     *
     * You can remove listeners by:
     * - Event type
     * - Namespace
     * - Handler reference
     * - Selector (for delegated events)
     * - Options
     *
     * If no event is provided, all listeners on the element are removed.
     *
     * @example
     * dom.off(button, 'click')
     * dom.off(button, 'click.menu')
     * dom.off(button, 'click', handler)
     * dom.off(list, 'click', '.item', handler)
     * dom.off(button) // removes all listeners
     *
     * @param {Element|Document|Window} el - Element to unbind listeners from
     * @param {string} [events] - Space-separated events (optionally namespaced)
     * @param {string|function} [selector] - Delegation selector or handler
     * @param {function|AddEventListenerOptions|boolean} [handler] - Specific handler to remove
     * @param {AddEventListenerOptions|boolean} [options] - Listener options to match
     * @returns {Element} - The element
     */
    off,
}

/* istanbul ignore next */
if ('test' === process.env.NODE_ENV) {
    dom.__resetCustomEventsForTests = function () {
        __resetCustomEventsForTests()
    }
}

export default dom

/* istanbul ignore next */
if ('undefined' !== typeof window) {
    window.webf = window.webf || {}
    window.webf.dom = dom
}
