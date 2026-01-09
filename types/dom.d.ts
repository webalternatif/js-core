export function isWindow(o: any): boolean;
export function isDocument(o: any): boolean;
export function isDomElement(o: any): boolean;
export function getStyle(el: Element, cssRule: string): string;
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
     * @param {string|Element|NodeList|Array<Element>} selector
     * @returns {Element}
     */
    function findOne(refEl: Element | Document | string, selector: string | Element | NodeList | Array<Element>): Element;
    /**
     * @param {Element|Document|string} refEl
     * @param {string|Element|NodeList|Array<Element>} selector
     * @returns {Array<Element>}
     */
    function find(refEl: Element | Document | string, selector: string | Element | NodeList | Array<Element>): Array<Element>;
    /**
     * @param {Element|string} el
     * @param {string} data
     * @param {string} [value]
     * @returns {Element|null}
     */
    function findOneByData(el: Element | string, data: string, value?: string): Element | null;
    /**
     * @param {Element|string} el
     * @param {string} data
     * @param {string} [value]
     * @returns {Element[]}
     */
    function findByData(el: Element | string, data: string, value?: string): Element[];
    /**
     * @param {Element|NodeList|Array<Element>} el
     * @param {string} className
     * @returns {Element|NodeList|Array<Element>}
     */
    function addClass(el: Element | NodeList | Array<Element>, className: string): Element | NodeList | Array<Element>;
    /**
     * @param {Element|NodeList|Array<Element>} el
     * @param {string} className
     * @returns {Element|NodeList|Array<Element>}
     */
    function removeClass(el: Element | NodeList | Array<Element>, className: string): Element | NodeList | Array<Element>;
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
     * @param {Node} node
     * @param {...(Node|string)} children
     * @returns {Node}
     */
    function append(node: Node, ...children: (Node | string)[]): Node;
    /**
     * @param {Node} node
     * @param {...(Node|string)} children
     * @returns {Node}
     */
    function prepend(node: Node, ...children: (Node | string)[]): Node;
    /**
     * @param {Element|NodeList|Array<Element>|string} els
     * @returns {void}
     */
    function remove(...els: Element | NodeList | Array<Element> | string): void;
    /**
     * @param {Element} el
     * @param {string|Element} [selector]
     * @returns {Element|null}
     */
    function closest(el: Element, selector?: string | Element): Element | null;
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
     * @param {Element|string} selector
     * @returns {Element[]}
     */
    function nextUntil(el: Element, selector: Element | string): Element[];
    /**
     * @param {Element} el
     * @param {Element|string} selector
     * @returns {Element[]}
     */
    function prevUntil(el: Element, selector: Element | string): Element[];
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
     * @returns {Element|DOMStringMap}
     */
    function data(el: Element, name: {
        [x: string]: string;
    } | string, value?: string): Element | DOMStringMap;
    /**
     * @param {Element} el
     * @param {string} name
     * @returns {Element|*}
     */
    function removeData(el: Element, name: string): Element | any;
    /**
     * @param {Element|Document|Window} el
     * @param {string} events
     * @param {string|Element|function} selector
     * @param {function|AddEventListenerOptions|boolean} [handler]
     * @param {AddEventListenerOptions|boolean} [options]
     * @returns {Element}
     */
    function on(el: Element | Document | Window, events: string, selector: string | Element | Function, handler?: Function | AddEventListenerOptions | boolean, options?: AddEventListenerOptions | boolean): Element;
    /**
     * @param {Element|Document|Window} el
     * @param {string} [events]
     * @param {string|Element|function} selector
     * @param {function|AddEventListenerOptions|boolean} [handler]
     * @param {AddEventListenerOptions|boolean} [options]
     * @returns {Element}
     */
    function off(el: Element | Document | Window, events?: string, selector: string | Element | Function, handler?: Function | AddEventListenerOptions | boolean, options?: AddEventListenerOptions | boolean): Element;
    /**
     * @param {HTMLElement} el
     * @param {Object<string, string>|string} style
     * @param {string} [value]
     * @returns {Element}
     */
    function css(el: HTMLElement, style: {
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
     * @param {NodeList|Element|Array<Element>} nodeList
     * @returns {Element|null}
     */
    function first(nodeList: NodeList | Element | Array<Element>): Element | null;
    /**
     * @param {NodeList|Array<Element>} nodeList
     * @returns {Element|null}
     */
    function last(nodeList: NodeList | Array<Element>): Element | null;
    /**
     * @param {string} html
     * @returns {Element|null}
     */
    function create(html: string): Element | null;
    /**
     * @param {NodeList|Array<Element>} nodeList
     * @param {number} [index=0]
     * @returns {Element|null}
     */
    function eq(nodeList: NodeList | Array<Element>, index?: number): Element | null;
    /**
     * @param {Element} el
     * @param {Element|string} newEl
     * @returns {Element|null}
     */
    function after(el: Element, newEl: Element | string): Element | null;
    /**
     * @param {Element} el
     * @param {Element|string} newEl
     * @returns {Element|null}
     */
    function before(el: Element, newEl: Element | string): Element | null;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    function empty(el: Element): Element;
    /**
     * @param {Element|NodeList} el
     * @param {string|Element} selector
     * @return {Element[]}
     */
    function not(el: Element | NodeList, selector: string | Element): Element[];
    /**
     * @param {Element} elem1
     * @param {Element} elem2
     * @returns {boolean}
     */
    function collide(elem1: Element, elem2: Element): boolean;
    /**
     * @param {Element} el
     * @param {string|Element} selector
     */
    function matches(el: Element, selector: string | Element): boolean;
    /**
     * @param {Element} el
     * @param {Element} child
     * @param {Element} oldChild
     */
    function replaceChild(el: Element, child: Element, oldChild: Element): Element;
    /**
     * @param {Element} el
     * @param {Element[]} children
     * @returns {Element}
     */
    function replaceChildren(el: Element, ...children: Element[]): Element;
    /**
     * @param {Element|Document|Window} el
     * @returns {{top: number, left: number}}
     */
    function offset(el: Element | Document | Window): {
        top: number;
        left: number;
    };
}
export default _default;
