import {translate, _, setLang, getLang} from '../src/i18n.js';

jest.mock('../i18n/index', () => {
    return {
        core: {
            en: { hello: 'Hello', goodbye: 'Goodbye' },
            fr: { hello: 'Bonjour' }
        },
        date: {
            en: { today: 'Today', tomorrow: () => 'Tomorrow' },
            fr: { today: 'Aujourd\'hui', tomorrow: () => 'Demain' }
        }
    };
})

describe('Translation system', () => {
    beforeEach(() => {
        Object.defineProperty(global, 'navigator', {
            value: { language: 'fr-FR' },
            configurable: true
        })
        process.env.LANG = 'fr-FR.UTF-8';
        process.env.LC_ALL = 'fr-FR.UTF-8';
        process.env.LC_MESSAGES = 'fr-FR.UTF-8';
    })

    it('should check process.env and navigator.language', () => {
        expect(process.env.LANG).toBe('fr-FR.UTF-8');
        expect(navigator.language).toBe('fr-FR');
    })

    it('should return the correct translation for a given language and namespace', () => {
        expect(translate('fr', 'core', 'hello')).toBe('Bonjour');
        expect(translate('en', 'date', 'today')).toBe('Today');
        expect(translate('fr', 'date', 'tomorrow')).toBe('Demain');
        expect(translate('en', 'date', 'tomorrow')).toBe('Tomorrow');
    })

    it('should fallback to English if translation is missing in the given language', () => {
        expect(translate('fr', 'core', 'goodbye')).toBe('Goodbye');
    })

    it('should fallback to the label if the translation is missing in all languages', () => {
        expect(translate('fr', 'core', 'unknown')).toBe('unknown');
    })

    it('should default to the current language when no language is specified', () => {
        expect(getLang()).toBe('fr');
        expect(translate('core', 'hello')).toBe('Bonjour');
    })

    it('should fallback to namespace "core" if no namespace is specified', () => {
        expect(translate('hello')).toBe('Bonjour');
    })

    it('should return the same result for translate and _', () => {
        expect(translate('en', 'core', 'hello')).toBe(_('en', 'core', 'hello'));
    })
})

describe('Language detection and setting', () => {
    let originalNavigator, originalProcess;

    beforeEach(() => {
        originalProcess = process;
        process.env.LANG = 'fr-FR.UTF-8';

        originalNavigator = { ...global.navigator };
        Object.defineProperty(global.navigator, 'language', {
            value: 'fr-FR',
            configurable: true
        })
    })

    afterEach(() => {
        process = originalProcess;
        Object.defineProperty(global.navigator, 'language', {
            value: originalNavigator.language,
            configurable: true
        })
    })

    it('should return the explicitly set language', () => {
        setLang('fr');
        expect(getLang()).toBe('fr');
    })

    it('should detect language from navigator.language', () => {
        Object.defineProperty(global.navigator, 'language', {
            value: 'es-ES',
            configurable: true
        })
        setLang();
        expect(getLang()).toBe('es');
    })

    it('should detect language from process.env if navigator.language is undefined', () => {
        Object.defineProperty(global.navigator, 'language', {
            value: null,
            configurable: true
        })
        setLang();
        expect(getLang()).toBe('fr');
    })

    it('should fallback to "en" if no language is detected', () => {
        Object.defineProperty(global.navigator, 'language', {
            value: null,
            configurable: true
        })
        process = undefined;

        setLang(); expect(getLang()).toBe('en');

        process = originalProcess;
        process.env.LANG = '';
        process.env.LC_ALL = 'en-US.UTF-8';

        setLang(); expect(getLang()).toBe('en');

        process.env.LANG = '';
        process.env.LC_ALL = '';
        process.env.LC_MESSAGES = 'en-US.UTF-8';

        setLang(); expect(getLang()).toBe('en');
    })

    it('should trim and normalize the language code', () => {
        setLang('  FR-fr  ');
        expect(getLang()).toBe('fr');
    })
})
