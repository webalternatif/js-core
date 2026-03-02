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
     * Normalize an event
     *
     * @param {Event|{originalEvent?: Event}|{detail?: {originalEvent?: Event}}} ev
     * @returns {{clientX:number, clientY:number, pageX:number, pageY:number}|null}
     */
    static "__#1@#getEvent"(ev: Event | {
        originalEvent?: Event;
    } | {
        detail?: {
            originalEvent?: Event;
        };
    }): {
        clientX: number;
        clientY: number;
        pageX: number;
        pageY: number;
    } | null;
}
