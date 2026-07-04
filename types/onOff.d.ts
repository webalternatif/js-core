/**
 * @param {Element|Document|Window|string} el
 * @param {string} events
 * @param {string|Element|function} selector
 * @param {function|AddEventListenerOptions|boolean} [handler]
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {Element|Document|Window|string}
 */
export function on(el: Element | Document | Window | string, events: string, selector: string | Element | Function, handler?: Function | AddEventListenerOptions | boolean, options?: AddEventListenerOptions | boolean): Element | Document | Window | string;
/**
 * @param {Element|Document|Window|string} el
 * @param {string} [events]
 * @param {string|Element|function} [selector]
 * @param {function|AddEventListenerOptions|boolean} [handler]
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {Element|Document|Window|string}
 */
export function off(el: Element | Document | Window | string, events?: string, selector?: string | Element | Function, handler?: Function | AddEventListenerOptions | boolean, options?: AddEventListenerOptions | boolean): Element | Document | Window | string;
export function __resetCustomEventsForTests(): void;
