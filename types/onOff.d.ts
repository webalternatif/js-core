/**
 * @param {Element|Document|Window} el
 * @param {string} events
 * @param {string|Element|function} selector
 * @param {function|AddEventListenerOptions|boolean} [handler]
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {Element}
 */
export function on(el: Element | Document | Window, events: string, selector: string | Element | Function, handler?: Function | AddEventListenerOptions | boolean, options?: AddEventListenerOptions | boolean): Element;
/**
 * @param {Element|Document|Window} el
 * @param {string} [events]
 * @param {string|Element|function} [selector]
 * @param {function|AddEventListenerOptions|boolean} [handler]
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {Element}
 */
export function off(el: Element | Document | Window, events?: string, selector?: string | Element | Function, handler?: Function | AddEventListenerOptions | boolean, options?: AddEventListenerOptions | boolean): Element;
export function __resetCustomEventsForTests(): void;
