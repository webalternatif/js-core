export default eventDispatcher;
declare const eventDispatcher: EventDispatcher;
declare class EventDispatcher {
    addListener(eventsName: any, callback: any, context: any, ...args: any[]): this;
    addListenerOnce(eventsName: any, callback: any, context: any, ...listenerArgs: any[]): this;
    dispatch(eventsName: any, ...args: any[]): this;
    hasListener(eventName: any, callback: any, context: any): boolean;
    removeListener(eventName: any, callback: any, context: any): this;
    getListeners(eventName: any): any;
    reset(): void;
    #private;
}
