export function isWindow(o: any): boolean;
export function isDomElement(o: any): boolean;
export function getStyle(elem: any, cssRule: any): any;
declare namespace _default {
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {NodeList}
     */
    function children(el: Element, selector?: string): NodeList;
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element|null}
     */
    function child(el: Element, selector?: string): Element | null;
    /**
     * @param {Element|Document|string} refEl
     * @param {string} [selector='*']
     * @returns {NodeList}
     */
    function find(refEl: Element | Document | string, selector?: string): NodeList;
    /**
     * @param {Element|Document|string} refEl
     * @param {string} [selector='*']
     * @returns {Element|null}
     */
    function findOne(refEl: Element | Document | string, selector?: string): Element | null;
    /**
     * @param {Element} el
     * @param {string} className
     * @returns {Element}
     */
    function addClass(el: Element, className: string): Element;
    /**
     * @param {Element} el
     * @param {string} classNames
     * @returns {Element}
     */
    function removeClass(el: Element, classNames: string): Element;
    /**
     * @param {Element} el
     * @param {string} classNames
     * @param {boolean} [force]
     * @returns {Element}
     */
    function toggleClass(el: Element, classNames: string, force?: boolean): Element;
    /**
     * @param {Element} el
     * @param {string} classNames
     * @returns {boolean}
     */
    function hasClass(el: Element, classNames: string): boolean;
    /**
     * @param {Element} el
     * @param {Element} child
     * @returns {Element}
     */
    function append(el: Element, child: Element): Element;
    /**
     * @param {Element} el
     * @param {Element} child
     * @returns {Element}
     */
    function prepend(el: Element, child: Element): Element;
    /**
     * @param {Element} el
     * @returns {void}
     */
    function remove(el: Element): void;
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element|null}
     */
    function closest(el: Element, selector?: string): Element | null;
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element|null}
     */
    function next(el: Element, selector?: string): Element | null;
    /**
     * @param {Element} el
     * @param {string|null} [selector]
     * @returns {Element|null}
     */
    function prev(el: Element, selector?: string | null): Element | null;
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element[]}
     */
    function nextAll(el: Element, selector?: string): Element[];
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element[]}
     */
    function prevAll(el: Element, selector?: string): Element[];
    /**
     * @param {Element} el
     * @param {Element} wrappingElement
     * @returns {Element}
     */
    function wrap(el: Element, wrappingElement: Element): Element;
    /**
     * @param {Element} el
     * @param {string} name
     * @param {*} [value]
     * @returns {Element|*}
     */
    function attr(el: Element, name: string, value?: any): Element | any;
    /**
     * @param {Element} el
     * @param {string} name
     * @param {*} [value]
     * @returns {*|Element}
     */
    function prop(el: Element, name: string, value?: any): any | Element;
    /**
     * @param {Element} el
     * @param {string} [html]
     * @returns {Element|*}
     */
    function html(el: Element, html?: string): Element | any;
    /**
     * @param {Element} el
     * @param {string} [text]
     * @returns {Element|*}
     */
    function text(el: Element, text?: string): Element | any;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    function hide(el: Element): Element;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    function show(el: Element): Element;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    function toggle(el: Element): Element;
    /**
     * @param {Element} el
     * @param {Object<string, string>|string} name
     * @param {string} [value]
     * @returns {Element}
     */
    function data(el: Element, name: {
        [x: string]: string;
    } | string, value?: string): Element;
    /**
     * @param {Element} el
     * @param {string} name
     * @returns {Element|*}
     */
    function removeData(el: Element, name: string): Element | any;
    /**
     * @param {Element|Document|Window} el
     * @param {string} event
     * @param {function} handler
     * @param {AddEventListenerOptions|false} options
     * @returns {Element}
     */
    function on(el: Element | Document | Window, event: string, handler: Function, options?: AddEventListenerOptions | false): Element;
    /**
     * @param {Element|Document|Window} el
     * @param {string} event
     * @param {function} handler
     * @param {Object} options
     * @returns {Element}
     */
    function off(el: Element | Document | Window, event: string, handler: Function, options: Object): Element;
    /**
     * @param {HTMLElement} el
     * @param {Object<string, string>|string} styles
     * @param {string} [value]
     * @returns {Element}
     */
    function css(el: HTMLElement, styles: {
        [x: string]: string;
    } | string, value?: string): Element;
    /**
     * @param {Element} el
     * @param {string} selectorClosest
     * @param {string} selectorFind
     * @returns {NodeList|null}
     */
    function closestFind(el: Element, selectorClosest: string, selectorFind: string): NodeList | null;
    /**
     * @param {Element} el
     * @param {string} selectorClosest
     * @param {string} selectorFindOne
     * @returns {Element|null}
     */
    function closestFindOne(el: Element, selectorClosest: string, selectorFindOne: string): Element | null;
    /**
     * @param {NodeList} nodeList
     * @returns {Element|null}
     */
    function first(nodeList: NodeList): Element | null;
    /**
     * @param {NodeList} nodeList
     * @returns {Element|null}
     */
    function last(nodeList: NodeList): Element | null;
    /**
     * @param {string} html
     * @returns {Element}
     */
    function create(html: string): Element;
    /**
     * @param {NodeList} nodeList
     * @param {number} [index=0]
     * @returns {Element|null}
     */
    function eq(nodeList: NodeList, index?: number): Element | null;
    /**
     * @param {Element} el
     * @param {Element} newEl
     * @returns {Element}
     */
    function after(el: Element, newEl: Element): Element;
    /**
     * @param {Element} el
     * @param {Element} newEl
     * @returns {Element}
     */
    function before(el: Element, newEl: Element): Element;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    function empty(el: Element): Element;
}
export default _default;
