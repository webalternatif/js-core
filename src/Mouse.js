import webf from '@webalternatif/js-core'

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
     * Normalize an event
     *
     * @param {Event|{originalEvent?: Event}|{detail?: {originalEvent?: Event}}} ev
     * @returns {{clientX:number, clientY:number, pageX:number, pageY:number}|null}
     */
    static #getEvent(ev) {
        const e = ev?.detail?.originalEvent ?? ev?.originalEvent ?? ev
        if (!e) return null

        const src = e.changedTouches?.[0] ?? e.touches?.[0] ?? e

        const clientX = typeof src.clientX === 'number' ? src.clientX : 0
        const clientY = typeof src.clientY === 'number' ? src.clientY : 0

        const pageX =
            typeof src.pageX === 'number'
                ? src.pageX
                : clientX + ('undefined' !== typeof window ? window.scrollX : 0)
        const pageY =
            typeof src.pageY === 'number'
                ? src.pageY
                : clientY + ('undefined' !== typeof window ? window.scrollY : 0)

        return { clientX, clientY, pageX, pageY }
    }
}

export default Mouse

/* istanbul ignore else */
if (typeof window !== 'undefined') {
    window.webf = window.webf || {}
    window.webf.mouse = Mouse
}
