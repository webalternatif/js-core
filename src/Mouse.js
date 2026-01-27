import { isTouchDevice } from './is.js'

class Mouse {
    /**
     * @param {Event} ev
     * @param {Element} element
     * @returns {{x: number, y: number}}
     */
    static getPosition(ev, element) {
        ev = this.#getEvent(ev)
        let rect = { left: 0, top: 0 }

        if (element instanceof Element) {
            const r = element.getBoundingClientRect()

            rect = {
                left: window.scrollX + r.left,
                top: window.scrollY + r.top,
            }
        }

        return {
            x: ev.pageX - rect.left,
            y: ev.pageY - rect.top,
        }
    }

    /**
     * @param {Event} ev
     * @returns {{x: number, y: number}}
     */
    static getViewportPosition(ev) {
        ev = this.#getEvent(ev)

        return {
            x: ev.clientX,
            y: ev.clientY,
        }
    }

    static getElement(ev) {
        ev = this.#getEvent(ev)

        return window.document.elementFromPoint(ev.clientX, ev.clientY)
    }

    /**
     * @param {Event|{originalEvent?: Event}} ev
     * @returns {Event}
     */
    static #getEvent(ev) {
        ev = ev.originalEvent ?? ev

        if (isTouchDevice()) {
            const touch = ev.changedTouches?.[0] || ev.touches?.[0]

            ev.clientX = touch.clientX
            ev.clientY = touch.clientY
            ev.pageX = touch.pageX
            ev.pageY = touch.pageY
        }

        return ev
    }
}

export default Mouse
