/**
 * @typedef {string | (() => string)} TranslatorValue
 */
/**
 * @typedef {Record<string, Record<string, Record<string, TranslatorValue>>>} TranslatorNsMapping
 */
/**
 * @typedef {Record<string, Record<string, TranslatorValue>>} TranslatorCoreMapping
 */
/**
 * @typedef {TranslatorNsMapping | TranslatorCoreMapping} TranslatorMapping
 */
export default class Translator {
    /**
     * @param {TranslatorMapping} mapping
     * @param {string} [defaultLang]
     */
    constructor(mapping: TranslatorMapping, defaultLang?: string);
    /**
     * @param {string} label
     * @param {string} [lang]
     * @param {string} [namespace='core']
     * @returns {string}
     */
    translate(label: string, lang?: string, namespace?: string): string;
    /**
     * @param {string} label
     * @param {string} from - Language from.
     * @param {string} to - Language to.
     * @param {string} [namespace='core']
     */
    translateFrom(label: string, from: string, to: string, namespace?: string): any;
    _(...args: any[]): string;
    getLang(): string;
    setLang(lang: any): void;
    #private;
}
export type TranslatorValue = string | (() => string);
export type TranslatorNsMapping = Record<string, Record<string, Record<string, TranslatorValue>>>;
export type TranslatorCoreMapping = Record<string, Record<string, TranslatorValue>>;
export type TranslatorMapping = TranslatorNsMapping | TranslatorCoreMapping;
