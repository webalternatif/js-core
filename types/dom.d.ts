export function isWindow(o: any): boolean;
export function isDocument(o: any): boolean;
export function isDomElement(o: any): boolean;
export function getStyle(el: Element, cssRule: string): string;
export default dom;
declare namespace dom {
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {NodeList}
     */
    export function children(el: Element, selector?: string): NodeList;
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element|null}
     */
    export function child(el: Element, selector?: string): Element | null;
    /**
     * @param {Element|Document|string} refEl
     * @param {string|Element|NodeList|Array<Element>} [selector]
     * @returns {Element}
     */
    export function findOne(refEl: Element | Document | string, selector?: string | Element | NodeList | Array<Element>): Element;
    /**
     * @param {Element|Document|string} refEl
     * @param {string|Element|NodeList|Array<Element>} [selector]
     * @returns {Array<Element>}
     */
    export function find(refEl: Element | Document | string, selector?: string | Element | NodeList | Array<Element>): Array<Element>;
    /**
     * @param {Element|string} el
     * @param {string} data
     * @param {string} [value]
     * @returns {Element|null}
     */
    export function findOneByData(el: Element | string, data: string, value?: string): Element | null;
    /**
     * @param {Element|string} el
     * @param {string} data
     * @param {string} [value]
     * @returns {Element[]}
     */
    export function findByData(el: Element | string, data: string, value?: string): Element[];
    /**
     * @param {Element|NodeList|Array<Element>} el
     * @param {string} className
     * @returns {Element|NodeList|Array<Element>}
     */
    export function addClass(el: Element | NodeList | Array<Element>, className: string): Element | NodeList | Array<Element>;
    /**
     * @param {Element|NodeList|Array<Element>} el
     * @param {string} className
     * @returns {Element|NodeList|Array<Element>}
     */
    export function removeClass(el: Element | NodeList | Array<Element>, className: string): Element | NodeList | Array<Element>;
    /**
     * @param {Element} el
     * @param {string} classNames
     * @param {boolean} [force]
     * @returns {Element}
     */
    export function toggleClass(el: Element, classNames: string, force?: boolean): Element;
    /**
     * @param {Element} el
     * @param {string} classNames
     * @returns {boolean}
     */
    export function hasClass(el: Element, classNames: string): boolean;
    /**
     * @param {Node} node
     * @param {...(Node|string)} children
     * @returns {Node}
     */
    export function append(node: Node, ...children: (Node | string)[]): Node;
    /**
     * @param {Node} node
     * @param {...(Node|string)} children
     * @returns {Node}
     */
    export function prepend(node: Node, ...children: (Node | string)[]): Node;
    /**
     * @param {Element|NodeList|Array<Element>|string} els
     * @returns {void}
     */
    export function remove(...els: Element | NodeList | Array<Element> | string): void;
    /**
     * @param {Element} el
     * @param {string|Element} [selector]
     * @returns {Element|null}
     */
    export function closest(el: Element, selector?: string | Element): Element | null;
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element|null}
     */
    export function next(el: Element, selector?: string): Element | null;
    /**
     * @param {Element} el
     * @param {string|null} [selector]
     * @returns {Element|null}
     */
    export function prev(el: Element, selector?: string | null): Element | null;
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element[]}
     */
    export function nextAll(el: Element, selector?: string): Element[];
    /**
     * @param {Element} el
     * @param {string} [selector]
     * @returns {Element[]}
     */
    export function prevAll(el: Element, selector?: string): Element[];
    /**
     * @param {Element} el
     * @param {Element|string} selector
     * @returns {Element[]}
     */
    export function nextUntil(el: Element, selector: Element | string): Element[];
    /**
     * @param {Element} el
     * @param {Element|string} selector
     * @returns {Element[]}
     */
    export function prevUntil(el: Element, selector: Element | string): Element[];
    /**
     * @param {Element} el
     * @param {Element} wrappingElement
     * @returns {Element}
     */
    export function wrap(el: Element, wrappingElement: Element): Element;
    /**
     * @param {Element} el
     * @param {string} name
     * @param {*} [value]
     * @returns {Element|*}
     */
    export function attr(el: Element, name: string, value?: any): Element | any;
    /**
     * @param {Element} el
     * @param {string} name
     * @param {*} [value]
     * @returns {*|Element}
     */
    export function prop(el: Element, name: string, value?: any): any | Element;
    /**
     * @param {Element} el
     * @param {string} [html]
     * @returns {Element|string}
     */
    export function html(el: Element, html?: string): Element | string;
    /**
     * @param {Element} el
     * @param {string} [text]
     * @returns {Element|string}
     */
    export function text(el: Element, text?: string): Element | string;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    export function hide(el: Element): Element;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    export function show(el: Element): Element;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    export function toggle(el: Element): Element;
    /**
     * @param {Element} el
     * @param {Object<string, string>|string} name
     * @param {string} [value]
     * @returns {Element|DOMStringMap}
     */
    export function data(el: Element, name: {
        [x: string]: string;
    } | string, value?: string): Element | DOMStringMap;
    /**
     * @param {Element} el
     * @param {string} name
     * @returns {Element|*}
     */
    export function removeData(el: Element, name: string): Element | any;
    /**
     * @param {HTMLElement} el
     * @param {Object<string, string>|string} style
     * @param {string} [value]
     * @returns {Element}
     */
    export function css(el: HTMLElement, style: {
        [x: string]: string;
    } | string, value?: string): Element;
    /**
     * @param {Element} el
     * @param {string} selectorClosest
     * @param {string} selectorFind
     * @returns {Array<Element>}
     */
    export function closestFind(el: Element, selectorClosest: string, selectorFind: string): Array<Element>;
    /**
     * @param {Element} el
     * @param {string} selectorClosest
     * @param {string} selectorFindOne
     * @returns {Element|null}
     */
    export function closestFindOne(el: Element, selectorClosest: string, selectorFindOne: string): Element | null;
    /**
     * @param {NodeList|Element|Array<Element>} nodeList
     * @returns {Element|null}
     */
    export function first(nodeList: NodeList | Element | Array<Element>): Element | null;
    /**
     * @param {NodeList|Array<Element>} nodeList
     * @returns {Element|null}
     */
    export function last(nodeList: NodeList | Array<Element>): Element | null;
    /**
     * @param {string} html
     * @returns {Element|DocumentFragment|null}
     */
    export function create(html: string): Element | DocumentFragment | null;
    /**
     * @param {NodeList|Array<Element>} nodeList
     * @param {number} [index=0]
     * @returns {Element|null}
     */
    export function eq(nodeList: NodeList | Array<Element>, index?: number): Element | null;
    /**
     * @param {Element} el
     * @param {Element|string} newEl
     * @returns {Element|null}
     */
    export function after(el: Element, newEl: Element | string): Element | null;
    /**
     * @param {Element} el
     * @param {Element|string} newEl
     * @returns {Element|null}
     */
    export function before(el: Element, newEl: Element | string): Element | null;
    /**
     * @param {Element} el
     * @returns {Element}
     */
    export function empty(el: Element): Element;
    /**
     * @param {Element|NodeList|Array<Element>} el
     * @param {string|Element} selector
     * @return {Array<Element>}
     */
    export function not(el: Element | NodeList | Array<Element>, selector: string | Element): Array<Element>;
    /**
     * @param {Element} elem1
     * @param {Element} elem2
     * @returns {boolean}
     */
    export function collide(elem1: Element, elem2: Element): boolean;
    /**
     * @param {Element} el
     * @param {string|Element} selector
     */
    export function matches(el: Element, selector: string | Element): boolean;
    /**
     * @param {Element} el
     * @param {Element} child
     * @param {Element} oldChild
     */
    export function replaceChild(el: Element, child: Element, oldChild: Element): Element;
    /**
     * @param {Element} el
     * @param {NodeList|Array<Element>|string[]} children
     * @returns {Element}
     */
    export function replaceChildren(el: Element, ...children: NodeList | Array<Element> | string[]): Element;
    /**
     * @param {Element|Document|Window} el
     * @returns {{top: number, left: number}}
     */
    export function offset(el: Element | Document | Window): {
        top: number;
        left: number;
    };
    /**
     * @param {Node} el
     * @returns {boolean}
     */
    export function isEditable(el: Node): boolean;
    /**
     * @param {Node} node
     * @returns {boolean}
     */
    export function isInDOM(node: Node): boolean;
    export { on };
    export { off };
}
import { on } from './onOff.js';
import { off } from './onOff.js';
