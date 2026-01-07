export function each<T>(o: Collection<T>, callback: (key: number | string, value: T, o: Collection<T>, index: number) => (void | boolean), context?: any): typeof o;
export function foreach<T>(o: Collection<T>, callback: (value: T, key: number | string, o: Collection<T>, index: number) => (void | boolean), context?: any): typeof o;
export function map<T, R>(o: Collection<T>, callback: (key: number | string, value: T, o: Collection<T>, index: number) => (R | null | false), context?: any): any[];
export function reduce<T, R>(o: Collection<T>, callback: (accumulator: R | T, value: T, key: any, index: number, o: Collection<T>) => R, initialValue?: R): R;
export function extend<T>(...args: (boolean | T)[]): T;
export function clone<T>(o: T): T;
export function merge<T>(first: Collection<T>, second?: Collection<T>, ...args: Collection<T>[]): Array<T>;
export type Collection<T> = Array<T> | Set<T> | Map<any, T> | {
    [x: string]: T;
} | string;
