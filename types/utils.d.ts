export function equals(o1: any, o2: any, seen?: WeakMap<WeakKey, any>): any;
export function noop(): void;
export function sizeOf(o: any): number;
export function flatten(o: Object | any[]): any[];
export function strParseFloat(val: any): number;
export function throttle(func: any, wait: any, leading?: boolean, trailing?: boolean, context?: null): (...args: any[]) => void;
export function debounce(func: Function, wait: number, immediate?: boolean, context?: Object): Function;
