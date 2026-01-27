import {isFunction, isTouchDevice} from "./is.js";
import {foreach, map} from "./traversal.js";
import {inArray} from "./array.js";
import Mouse from "./Mouse.js";

const LISTENERS = new Map();
const CUSTOM_EVENTS = [
    'longtap',
    'dbltap'
]
const ENABLED_EVENTS = new Set();

let teardownLongTap = null;
let teardownDblTap = null;

const supplyEvent = function (event) {
    if (ENABLED_EVENTS?.has(event)) return;

    if (event === 'longtap') enableLongTap();
    if (event === 'dbltap') enableDblTap();

    ENABLED_EVENTS.add(event);
}

const enableLongTap = function () {
    const LONGPRESS_DELAY = 800;
    const MOVE_TOLERANCE = 40;

    let timer = null;
    let startX = 0;
    let startY = 0;
    let target = null;

    const start = (ev) => {
        target = ev.target;

        const pos = Mouse.getViewportPosition(ev);
        startX = pos.x;
        startY = pos.y;

        timer = setTimeout(() => {
            target.dispatchEvent(new CustomEvent('longtap', {
                bubbles: true,
                cancelable: true,
                detail: {originalEvent: ev}
            }));

            timer = null;
        }, LONGPRESS_DELAY);
    };

    const move = (ev) => {
        // if (!timer) return;

        const pos = Mouse.getViewportPosition(ev)

        if (Math.hypot(pos.x - startX, pos.y - startY) > MOVE_TOLERANCE) {
            clearTimeout(timer);
            timer = null;
        }
    };

    const end = () => {
        clearTimeout(timer);
        timer = null;
    };

    document.addEventListener('touchstart', start, {passive: true});
    document.addEventListener('touchmove', move, {passive: true});
    document.addEventListener('touchend', end);
    document.addEventListener('touchcancel', end);

    teardownLongTap = () => {
        document.removeEventListener('touchstart', start, { passive: true });
        document.removeEventListener('touchmove', move, { passive: true });
        document.removeEventListener('touchend', end);
        document.removeEventListener('touchcancel', end);
        teardownLongTap = null;
    };
}

const enableDblTap = function () {
    const DBLTAP_DELAY = 300;
    const MOVE_TOLERANCE = 40;
    let lastTapTime = 0;
    let lastPos = null;

    if (isTouchDevice()) {
        document.addEventListener('dblclick', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
        }, { capture: true });
    }

    const start = (ev) => {
        const target = ev.target;

        if (Date.now() - lastTapTime > DBLTAP_DELAY) {
            lastTapTime = Date.now()
            lastPos = Mouse.getViewportPosition(ev)
        } else {
            const pos = Mouse.getViewportPosition(ev);

            if (Math.hypot(pos.x - lastPos.x, pos.y - lastPos.y) <= MOVE_TOLERANCE) {
                target.dispatchEvent(new CustomEvent('dbltap', {
                    bubbles: true,
                    cancelable: true,
                    detail: { originalEvent: ev }
                }));
            }

            lastTapTime = Date.now();
            lastPos = pos;
        }
    };

    document.addEventListener('touchstart', start, { passive: true });

    teardownDblTap = () => {
        document.removeEventListener('touchstart', start, { passive: true });
        teardownDblTap = null;
    };
}

/**
 * @param {Element} target
 * @param {Element} el
 * @returns {Element[]}
 */
function buildTree(target, el) {
    const path = [];
    let node = target.nodeType === 3 ? target.parentElement : target;

    while (node) {
        path.push(node);
        if (node === el)
            break;
        node = node.parentElement;
    }

    return path;
}

function createWrappedEvent(ev, currentTarget) {
    const wrappedEv = {
        _immediateStopped: false,
        _propagationStopped: false,
        originalEvent: ev,
        currentTarget,

        stopPropagation: (...args) => {
            wrappedEv._propagationStopped = true;
            ev.stopPropagation(...args);
        },

        stopImmediatePropagation: (...args) => {
            wrappedEv._immediateStopped = true;
            wrappedEv._propagationStopped = true;
            ev.stopImmediatePropagation(...args);
        },
    }

    return new Proxy(wrappedEv, {
        get(target, prop, receiver) {
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }

            const value = ev[prop];
            return isFunction(value) ? value.bind(ev) : value;
        }
    });
}

/**
 * @param {Element|Document|Window} el
 * @param {string} events
 * @param {string|Element|function} selector
 * @param {function|AddEventListenerOptions|boolean} [handler]
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {Element}
 */
export function on(el, events, selector, handler, options) {
    if (isFunction(selector)) {
        options = handler;
        handler = selector;
        selector = null;
    }

    foreach(events.split(' '), (rawEvent) => {
        const [event, namespace] = rawEvent.split('.');

        const listener = (ev) => {
            if (ev.cancelBubble) return;

            const tree = buildTree(ev.target, el);

            const binds = [...LISTENERS.get(el)];

            for (const node of tree) {
                let propagationStoppedOnThisNode = false;

                for (const bind of binds) {
                    if (bind.event !== ev.type) continue;

                    if (bind.selector) {
                        if (!node.matches(bind.selector)) continue;
                    } else {
                        if (node !== el) continue;
                    }

                    const wrappedEv = createWrappedEvent(ev, node);
                    bind.handler.call(node, wrappedEv);

                    if (wrappedEv._immediateStopped) return;

                    if (wrappedEv._propagationStopped) {
                        propagationStoppedOnThisNode = true;
                    }
                }

                if (propagationStoppedOnThisNode) return;
            }
        }

        let store = LISTENERS.get(el);
        if (!store) {
            store = [];
            LISTENERS.set(el, store);
        }

        if (inArray(event, CUSTOM_EVENTS)) {
            supplyEvent(event);
        }

        const events = map(store, (_, entry) => entry.event)

        if (!inArray(event, events)) {
            el.addEventListener(event, listener, options);
        }

        store.push({ event, handler, selector, listener, namespace, options });
    });

    return el;
}

/**
 * @param {Element|Document|Window} el
 * @param {string} [events]
 * @param {string|Element|function} [selector]
 * @param {function|AddEventListenerOptions|boolean} [handler]
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {Element}
 */
export function off(el, events, selector, handler, options) {
    if (isFunction(selector)) {
        options = handler;
        handler = selector;
        selector = null;
    }

    const store = LISTENERS.get(el);
    if (!store) return el;

    const evts = events ? events.split(' ') : [undefined];

    foreach(evts, rawEvent => {
        let [event, namespace] = undefined === rawEvent ? [undefined, undefined] : rawEvent.split('.');

        event = !event ? undefined : event;

        const hasEvent = undefined !== event;
        const hasNs = undefined !== namespace;

        foreach([...store].reverse(), (l) => {
            const match =
                (!hasEvent  && !hasNs) ||
                (hasEvent   && !hasNs && l.event === event) ||
                (!hasEvent  && hasNs  && l.namespace === namespace) ||
                (hasEvent   && hasNs  && l.event === event && l.namespace === namespace);

            if (
                match &&
                (undefined === event     || l.event === event) &&
                (undefined === handler   || l.handler === handler) &&
                (undefined === selector  || l.selector === selector) &&
                (undefined === namespace || l.namespace === namespace) &&
                (undefined === options   || l.options === options)
            ) {
                const index = store.indexOf(l);
                index !== -1 && store.splice(index, 1);

                if (!map(store, (_, entry) => entry.event === event ? entry : null)[0])
                    el.removeEventListener(l.event, l.listener, l.options);
            }
        });
    });

    return el;
}

export function __resetCustomEventsForTests () {
    ENABLED_EVENTS.clear();
    teardownLongTap?.();
    teardownDblTap?.();
}
