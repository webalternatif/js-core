import {isFunction, isPlainObject} from "./is.js";
import {each, extend} from "./traversal.js";

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
    /** @type string */
    #lang;

    /** @type TranslatorMapping */
    #mapping;

    /**
     * @param {TranslatorMapping} mapping
     * @param {string} [defaultLang]
     */
    constructor(mapping, defaultLang) {
        this.#setMapping(mapping);
        this.setLang(defaultLang);
    }

    #setMapping(mapping) {
        let nsMapping = {},
            coreMapping = {};

        each(mapping, (ns, langs) => {
            each(langs, (lang, trads) => {
                if (isPlainObject(trads)) {
                    if (undefined === nsMapping[ns]) nsMapping[ns] = {};
                    nsMapping[ns][lang] = trads;
                } else {
                    if (undefined === coreMapping[ns]) coreMapping[ns] = {};
                    coreMapping[ns][lang] = trads;
                }
            })
        })

        this.#mapping = extend(true, nsMapping, {core: extend({}, nsMapping.core || {}, coreMapping)});
    }

    /**
     * @param {string} label
     * @param {string} [namespace]
     * @param {string} [lang]
     * @returns {string}
     */
    translate(label, namespace, lang) {
        lang = undefined === lang ? this.getLang() : lang;
        namespace = undefined === namespace ? 'core' : namespace;

        const translationExists =
            undefined !== this.#mapping[namespace] &&
            undefined !== this.#mapping[namespace][lang] &&
            undefined !== this.#mapping[namespace][lang][label];

        if (translationExists) {
            const tr = this.#mapping[namespace][lang][label];
            return isFunction(tr) ? tr() : tr;
        }

        return 'en' !== lang ? this.translate(label, namespace, 'en') : label;
    }

    _(...args) {
        return this.translate(...args)
    }

    getLang() {
        return this.#lang;
    }

    setLang(lang) {
        if (!lang) {
            if (typeof navigator !== 'undefined' && navigator.language) {
                lang = navigator.language;
            } else if (typeof process !== 'undefined' && process.env) {
                lang = (process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES);
            }
        }

        this.#lang = (lang || 'en').trim().toLowerCase().slice(0, 2);
    }
}
