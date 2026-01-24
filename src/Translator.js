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
     * @param {string} [lang]
     * @param {string} [namespace='core']
     * @returns {string}
     */
    translate(label, lang, namespace = 'core') {
        lang = undefined === lang ? this.getLang() : lang;

        const translationExists =
            undefined !== this.#mapping[namespace] &&
            undefined !== this.#mapping[namespace][lang] &&
            undefined !== this.#mapping[namespace][lang][label];

        if (translationExists) {
            const entry = this.#mapping[namespace][lang][label];
            return this.#resolve(entry);
        }

        return 'en' !== lang ? this.translate(label, 'en', namespace) : label;
    }

    /**
     * @param {string} label
     * @param {string} from - Language from.
     * @param {string} to - Language to.
     * @param {string} [namespace='core']
     */
    translateFrom(label, from, to, namespace = 'core') {
        if (!label) return label;

        const mapNs = this.#mapping?.[namespace];
        if (!mapNs) return label;

        const mapFrom = mapNs?.[from];
        const mapTo = mapNs?.[to];
        if (!mapFrom || !mapTo) return label;

        const key = this.#findKeyByValue(mapFrom, label);
        if (!key) return label;

        const entryTo = mapTo[key];
        const resolvedTo = this.#resolve(entryTo);

        return resolvedTo ?? label;
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

    #findKeyByValue(entries, label) {
        for (const key in entries) {
            const resolved = this.#resolve(entries[key]);
            if (resolved === label) return key;
        }

        return null;
    }

    #resolve(entry) {
        if (isFunction(entry)) {
            try {
                return entry();
            } catch (e) {
                return null;
            }
        }

        return entry;
    }
}
