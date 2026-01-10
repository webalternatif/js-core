import {isTouchDevice} from "./is.js";

class Mouse
{
    static getPosition(ev, element) {
        ev = this.#getEvent(ev);
        let rect = { left: 0, top: 0 };

        if (element instanceof Element) {
            const r = element.getBoundingClientRect();

            rect = {
                left: window.scrollX + r.left,
                top: window.scrollY + r.top
            };
        }

        return {
            x: ev.pageX !== undefined ? ev.pageX - rect.left : rect.left,
            y: ev.pageY !== undefined ? ev.pageY - rect.top : rect.top
        };
    }

    static getViewportPosition(ev) {
        ev = this.#getEvent(ev);

        return {
            x: ev.clientX,
            y: ev.clientY
        };
    }

    static getElement(ev) {
        ev = this.#getEvent(ev);

        return window.document.elementFromPoint(ev.clientX, ev.clientY);
    }

    static #getEvent(ev) {
        if (isTouchDevice()) {
            const orgEvent = ev.originalEvent ? ev.originalEvent : ev;

            if (orgEvent.changedTouches && orgEvent.changedTouches.length) {
                ev = orgEvent.changedTouches[0];
            } else if (orgEvent.touches) {
                ev = orgEvent.touches[0];
            }
        }

        return ev.originalEvent ?? ev;
    }
}

export default Mouse
