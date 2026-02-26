export function round(val: number, precision?: number): number;
export function floorTo(val: number, precision: number): number;
export function plancher(val: number, precision: number): number;
export function min<T>(list: Iterable<T> | Record<string, T>, cmp_func?: (a: T, b: T) => number): T | undefined;
export function max<T>(list: Collection<T>, cmp_func?: (a: T, b: T) => number): T | undefined;
export function dec2hex(n: number): string;
export function hex2dec(hex: string): number;
export type Collection = any;
