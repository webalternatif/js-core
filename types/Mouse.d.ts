export default Mouse;
declare class Mouse {
    /**
     * @param {Event} ev
     * @param {Element} element
     * @returns {{x: number, y: number}}
     */
    static getPosition(ev: Event, element: Element): {
        x: number;
        y: number;
    };
    /**
     * @param {Event} ev
     * @returns {{x: number, y: number}}
     */
    static getViewportPosition(ev: Event): {
        x: number;
        y: number;
    };
    static getElement(ev: any): Element | null;
    /**
     * @param {Event|{originalEvent?: Event}} ev
     * @returns {Event}
     */
    static "__#1@#getEvent"(ev: Event | {
        originalEvent?: Event;
    }): Event;
}
