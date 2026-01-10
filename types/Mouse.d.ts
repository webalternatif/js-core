export default Mouse;
declare class Mouse {
    static getPosition(ev: any, element: any): {
        x: number;
        y: number;
    };
    static getViewportPosition(ev: any): {
        x: any;
        y: any;
    };
    static getElement(ev: any): Element | null;
    static "__#1@#getEvent"(ev: any): any;
}
