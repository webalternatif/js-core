import Translator from '../src/Translator.js'

const mapping = {
    en: { hello: 'Hello', goodbye: 'Goodbye' },
    fr: { hello: 'Bonjour' },
    core: {
        en: { bye: 'Bye' },
        fr: { bye: 'Au revoir' },
    },
    date: {
        en: { today: 'Today', tomorrow: () => 'Tomorrow' },
        fr: { today: "Aujourd'hui", tomorrow: () => 'Demain' },
    },
    dialog: {
        en: { close: 'Close', submit: 'Submit' },
        fr: { close: 'Fermer', submit: 'Soumettre' },
    },
}

/** @type Translator */
let translator

beforeEach(() => {
    translator = new Translator(mapping)
})

describe('Translation system', () => {
    beforeEach(() => {
        Object.defineProperty(global, 'navigator', {
            value: { language: 'fr-FR' },
            configurable: true,
        })
        process.env.LANG = 'fr-FR.UTF-8'
        process.env.LC_ALL = 'fr-FR.UTF-8'
        process.env.LC_MESSAGES = 'fr-FR.UTF-8'
    })

    it('should check process.env and navigator.language', () => {
        expect(process.env.LANG).toBe('fr-FR.UTF-8')
        expect(navigator.language).toBe('fr-FR')
    })

    it('should return the correct translation for a given language and namespace', () => {
        expect(translator.translate('today', 'en', 'date')).toBe('Today')
        expect(translator.translate('tomorrow', 'fr', 'date')).toBe('Demain')
        expect(translator.translate('tomorrow', 'en', 'date')).toBe('Tomorrow')
    })

    it('should fallback to English if translation is missing in the given language', () => {
        expect(translator.translate('goodbye', 'fr')).toBe('Goodbye')
    })

    it('should fallback to the label if the translation is missing in all languages', () => {
        expect(translator.translate('unknown', 'fr')).toBe('unknown')
    })

    it('should default to the current language when no language is specified', () => {
        expect(translator.getLang()).toBe('fr')
        expect(translator.translate('hello')).toBe('Bonjour')
    })

    it('should fallback to namespace "core" if no namespace is specified', () => {
        expect(translator.translate('hello')).toBe('Bonjour')
    })

    it('should return the same result for translate and _', () => {
        expect(translator.translate('hello', 'en')).toBe(translator._('hello', 'en'))
    })
})

describe('Language detection and setting', () => {
    let originalNavigator, originalProcess

    beforeEach(() => {
        originalProcess = process
        process.env.LANG = 'fr-FR.UTF-8'

        originalNavigator = { ...global.navigator }
        Object.defineProperty(global.navigator, 'language', {
            value: 'fr-FR',
            configurable: true,
        })
    })

    afterEach(() => {
        process = originalProcess
        Object.defineProperty(global.navigator, 'language', {
            value: originalNavigator.language,
            configurable: true,
        })
    })

    it('should return the explicitly set language', () => {
        translator.setLang('fr')
        expect(translator.getLang()).toBe('fr')
    })

    it('should detect language from navigator.language', () => {
        Object.defineProperty(global.navigator, 'language', {
            value: 'es-ES',
            configurable: true,
        })
        translator.setLang()
        expect(translator.getLang()).toBe('es')
    })

    it('should detect language from process.env if navigator.language is undefined', () => {
        Object.defineProperty(global.navigator, 'language', {
            value: null,
            configurable: true,
        })
        translator.setLang()
        expect(translator.getLang()).toBe('fr')
    })

    it('should fallback to "en" if no language is detected', () => {
        Object.defineProperty(global.navigator, 'language', {
            value: null,
            configurable: true,
        })
        process = undefined

        translator.setLang()
        expect(translator.getLang()).toBe('en')

        process = originalProcess
        process.env.LANG = ''
        process.env.LC_ALL = 'en-US.UTF-8'

        translator.setLang()
        expect(translator.getLang()).toBe('en')

        process.env.LANG = ''
        process.env.LC_ALL = ''
        process.env.LC_MESSAGES = 'en-US.UTF-8'

        translator.setLang()
        expect(translator.getLang()).toBe('en')
    })

    it('should trim and normalize the language code', () => {
        translator.setLang('  FR-fr  ')
        expect(translator.getLang()).toBe('fr')
    })
})

describe('Translation from one lang to another', () => {
    it('should return Hello from Bonjour', () => {
        expect(translator.translateFrom('Bonjour', 'fr', 'en')).toBe('Hello')
    })

    it('should resolve function entries', () => {
        expect(translator.translateFrom('Demain', 'fr', 'en', 'date')).toBe('Tomorrow')
    })

    it('should return label if label is falsy', () => {
        expect(translator.translateFrom('', 'fr', 'en')).toBe('')
        expect(translator.translateFrom(null, 'fr', 'en')).toBe(null)
    })

    it('should return label if namespace does not exist', () => {
        expect(translator.translateFrom('Bonjour', 'fr', 'en', 'unknown')).toBe('Bonjour')
    })

    it('should return label if source language map is missing', () => {
        expect(translator.translateFrom('Bonjour', 'es', 'en')).toBe('Bonjour')
    })

    it('should return label if target language map is missing', () => {
        expect(translator.translateFrom('Bonjour', 'fr', 'es')).toBe('Bonjour')
    })

    it('should return label if value is not found in source language map', () => {
        expect(translator.translateFrom('Salut', 'fr', 'en')).toBe('Salut')
    })

    it('should return label if target entry resolves to falsy value', () => {
        const brokenMapping = {
            fr: { hello: 'Bonjour' },
            en: { hello: null },
        }

        const t = new Translator(brokenMapping)
        expect(t.translateFrom('Bonjour', 'fr', 'en')).toBe('Bonjour')
    })
})
