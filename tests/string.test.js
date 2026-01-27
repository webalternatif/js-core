import * as is from '../src/is'
import * as stringUtils from '../src/string'
import {
    trim,
    ltrim,
    rtrim,
    stripMultipleSpaces,
    noAccent,
    br2nl,
    nl2br,
    ucfirst,
    lcfirst,
    insertTag,
    isString,
    insert,
    substringIndex,
    reverse,
    thousandSeparator,
    numberFormat,
    toPrice,
    pad,
    rgb2hex,
    hex2rgb,
    parse_url,
    addUrlParam,
    decodeHtml,
    htmlquotes,
    htmlsimplequotes,
    repeat,
    stripTags,
    toUrl,
    escapeRegex,
    camelCase,
    format,
    toCssClassName,
    compareMixAlphaDigits,
    formatSize,
    hilite,
} from '../src/string'
import Translator, { setLang } from '../src/Translator.js'

describe('String methods', () => {
    const [str1, str2, str3, str4, str5, str6, str7] = [
        'On en a gros !',
        '   Hello World   ',
        'aaHello Worldaa',
        'Hello   World',
        'àäâèéêëîïíöôüùçÿÀÄÂÈÉÊËÎÏÍÖÔÜÙÇŸ',
        'Hello<br>world<br/>!<br />',
        '&amp;&lt;&gt;&quot;&#039;',
    ]

    describe('trim(), ltrim(), rtrim()', () => {
        it('should remove spaces at the beginning and end of the string', () => {
            expect(trim(str2)).toBe('Hello World')
        })

        it('should remove characters "a" at the beginning and end of the string', () => {
            expect(trim(str3, 'a')).toBe('Hello World')
        })

        it('should remove spaces at the beginning of the string', () => {
            expect(ltrim(str2)).toBe('Hello World   ')
        })

        it('should remove characters "a" at the end of the string', () => {
            expect(ltrim(str3, 'a')).toBe('Hello Worldaa')
        })

        it('should remove spaces at the end of the string', () => {
            expect(rtrim(str2)).toBe('   Hello World')
        })

        it('should remove characters "a" at the end of the string', () => {
            expect(rtrim(str3, 'a')).toBe('aaHello World')
        })
    })

    describe('stripMultipleSpaces()', () => {
        it('should replace multiple spaces in the string with a single space.', () => {
            expect(stripMultipleSpaces(str4)).toBe('Hello World')
        })
    })

    describe('noAccent()', () => {
        it('should replace accented characters with their unaccented equivalents.', () => {
            expect(noAccent(str5)).toBe('aaaeeeeiiioouucyAAAEEEEIIIOOUUCY')
        })
    })

    describe('br2nl(), nl2br()', () => {
        it('should replace br tags with \n', () => {
            expect(br2nl(str6)).toBe('Hello\nworld\n!\n')
        })

        it('should replace \\n with br tags', () => {
            expect(nl2br(br2nl(str6))).toBe('Hello<br>world<br>!<br>')
        })
    })

    describe('ucfirst(), lcfirst()', () => {
        it("should make a string's first character uppercase", () => {
            expect(ucfirst(str1.toLowerCase())).toBe('On en a gros !')
            expect(ucfirst('étienne')).toBe('Étienne')
        })

        it("should Make a string's first character lowercase", () => {
            expect(lcfirst(str1.toUpperCase())).toBe('oN EN A GROS !')
            expect(lcfirst('ÉTIENNE')).toBe('éTIENNE')
        })
    })

    describe('insertTag()', () => {
        it('should wrap a specified portion of a string with given opening and closing tags', () => {
            expect(insertTag(str1, 'b', 8, 4)).toBe('On en a <b>gros</b> !')
            expect(insertTag(str1, 'br', 8)).toBe('On en a <br/>gros !')
            expect(insertTag(str1, 'span')).toBe('<span></span>On en a gros !')
        })
    })

    describe('isString()', () => {
        it('should return true for a primitive string', () => {
            expect(is.isString('hello')).toBe(true)
        })

        it('should return true for a String object', () => {
            expect(is.isString(new String('hello'))).toBe(true)
        })
    })

    describe('insert()', () => {
        it('should insert the specified string at regular intervals in the input string', () => {
            expect(insert('abcdefghi', '-', 3)).toBe('abc-def-ghi')
            expect(insert('123456789', '/', 2)).toBe('12/34/56/78/9')
        })

        it('should handle cases where n is greater than or equal to the string length', () => {
            expect(insert('hello', '*', 10)).toBe('hello')
            expect(insert('hello', '*', 5)).toBe('hello')
        })

        it('should handle empty strings', () => {
            expect(insert('', '-', 2)).toBe('')
        })

        it('should handle n = 0', () => {
            expect(insert('abcdef', '-', 0)).toBe('abcdef')
        })

        it('should handle single-character strings', () => {
            expect(insert('a', '-', 1)).toBe('a')
            expect(insert('a', '-', 0)).toBe('a')
        })

        it('should insert correctly when n = 1', () => {
            expect(insert('abc', '-', 1)).toBe('a-b-c')
        })

        it('should handle special characters in the insertion string', () => {
            expect(insert('abcdef', '#@', 2)).toBe('ab#@cd#@ef') // Insère "#@" toutes les 2 lettres
        })

        it('should handle large strings and intervals', () => {
            const input = 'a'.repeat(1000)
            const expected = 'a'.repeat(99) + '-a'
            expect(insert(input, '-', 100)).toContain(expected)
        })
    })

    describe('substringIndex()', () => {
        it('should return the substring up to the specified positive index', () => {
            expect(substringIndex('a-b-c-d-e', '-', 3)).toBe('a-b-c')
            expect(substringIndex('apple.orange.banana', '.', 2)).toBe('apple.orange')
            expect(substringIndex('abc/def/ghf', '/', 1)).toBe('abc')
        })

        it('should return the substring starting from the specified negative index', () => {
            expect(substringIndex('a-b-c-d-e', '-', -2)).toBe('d-e')
            expect(substringIndex('apple.orange.banana', '.', -1)).toBe('banana')
        })

        it('should handle index = 0 by returning the original string', () => {
            expect(substringIndex('a-b-c-d-e', '-', 0)).toBe('a-b-c-d-e')
            expect(substringIndex('apple.orange.banana', '.', 0)).toBe('apple.orange.banana')
        })

        it('should handle cases where the index exceeds the length of the string', () => {
            expect(substringIndex('a-b-c', '-', 10)).toBe('a-b-c')
            expect(substringIndex('apple.orange', '.', 5)).toBe('apple.orange')
        })

        it('should handle cases where the negative index exceeds the length of the string', () => {
            expect(substringIndex('a-b-c', '-', -10)).toBe('a-b-c')
            expect(substringIndex('apple.orange', '.', -5)).toBe('apple.orange')
        })

        it('should handle strings without delimiters', () => {
            expect(substringIndex('abcdef', '-', 2)).toBe('abcdef')
            expect(substringIndex('abcdef', '-', -2)).toBe('abcdef')
        })

        it('should handle empty strings', () => {
            expect(substringIndex('', '-', 2)).toBe('') // Chaîne vide retourne vide
            expect(substringIndex('', '-', -2)).toBe('') // Chaîne vide retourne vide
        })

        it('should handle edge cases with single character strings and delimiters', () => {
            expect(substringIndex('-', '-', 1)).toBe('') // Délimiteur seul retourne vide
            expect(substringIndex('-', '-', -1)).toBe('') // Délimiteur seul retourne vide
            expect(substringIndex('a', '-', 1)).toBe('a') // Aucune modification si pas de délimiteur
        })
    })

    describe('reverse function', () => {
        it('should reverse a regular string', () => {
            expect(reverse('hello')).toBe('olleh')
            expect(reverse('abcdef')).toBe('fedcba')
        })

        it('should handle an empty string', () => {
            expect(reverse('')).toBe('')
        })

        it('should handle a string with a single character', () => {
            expect(reverse('a')).toBe('a')
        })

        it('should handle strings with spaces', () => {
            expect(reverse('hello world')).toBe('dlrow olleh')
            expect(reverse(' a b ')).toBe(' b a ')
        })

        it('should handle strings with special characters', () => {
            expect(reverse('!@#$')).toBe('$#@!')
            expect(reverse('1234!')).toBe('!4321')
        })

        it('should handle strings with numbers', () => {
            expect(reverse('12345')).toBe('54321')
            expect(reverse('1a2b3c')).toBe('c3b2a1')
        })
    })

    describe('thousandSeparator()', () => {
        it('should format numbers with default separator and decimal point', () => {
            expect(thousandSeparator(1234567.89)).toBe('1.234.567.89')
            expect(thousandSeparator(1234)).toBe('1.234')
        })

        it('should handle negative numbers correctly', () => {
            expect(thousandSeparator(-1234567.89)).toBe('-1.234.567.89')
            expect(thousandSeparator(-1234)).toBe('-1.234')
        })

        it('should handle values less than 1000 without adding separators', () => {
            expect(thousandSeparator(999)).toBe('999')
            expect(thousandSeparator(-999)).toBe('-999')
        })

        it('should replace decimal point with a custom character', () => {
            expect(thousandSeparator(1234567.89, '.', ',')).toBe('1.234.567,89')
            expect(thousandSeparator(1234.56, '.', ',')).toBe('1.234,56')
        })

        it('should handle custom thousand separators', () => {
            expect(thousandSeparator(1234567.89, ',', '.')).toBe('1,234,567.89')
            expect(thousandSeparator(1234, ',', '.')).toBe('1,234')
        })

        it('should handle strings as input and convert commas to dots', () => {
            expect(thousandSeparator('1234,56')).toBe('1.234.56')
            expect(thousandSeparator('1234567,89')).toBe('1.234.567.89')
        })

        it('should handle edge cases like zero and empty strings', () => {
            expect(thousandSeparator(0)).toBe('0')
            expect(thousandSeparator('')).toBe('')
        })

        it('should handle invalid or non-numeric input gracefully', () => {
            expect(thousandSeparator('abc')).toBe('abc')
            expect(thousandSeparator(undefined)).toBeUndefined()
        })
    })

    describe('numberFormat(), toPrice()', () => {
        it('should format numbers with default parameters', () => {
            expect(numberFormat('12345.678')).toBe('12345.68')
            expect(numberFormat(12345.678)).toBe('12345.68')
        })

        it('should handle zero decimals and no thousand separator', () => {
            expect(numberFormat('12345.678', 0)).toBe('12346')
            expect(numberFormat(12345.678, 0)).toBe('12346')
            expect(numberFormat(12345.0, 0)).toBe('12345')
        })

        it('should force centimes when requested', () => {
            expect(numberFormat('12345', 2, true)).toBe('12345.00')
            expect(numberFormat(12345, 3, true)).toBe('12345.000')
        })

        it('should handle custom thousand separators', () => {
            expect(numberFormat('12345.678', 2, false, ',')).toBe('12,345.68')
            expect(numberFormat('12345678.9', 1, false, ' ')).toBe('12 345 678.9')
        })

        it('should handle custom decimal points', () => {
            expect(numberFormat('12345.678', 2, false, '', ',')).toBe('12345,68')
            expect(numberFormat('12345.6', 2, true, '', ',')).toBe('12345,60')
        })

        it('should handle zero as input', () => {
            expect(numberFormat(0, 2, true)).toBe('0.00')
            expect(numberFormat(0, 0)).toBe('0')
        })

        it('should handle very small numbers correctly', () => {
            expect(numberFormat('0.0001234', 4)).toBe('0.0001')
            expect(numberFormat(0.0001234, 5)).toBe('0.00012')
        })

        it('should handle large numbers with custom formats', () => {
            expect(numberFormat('1234567890.12', 2, false, ',', '.')).toBe('1,234,567,890.12') // Séparateur standard
            expect(numberFormat('1234567890.12', 0, false, ',')).toBe('1,234,567,890') // Pas de décimales
        })

        it('should handle invalid inputs gracefully', () => {
            expect(numberFormat('notANumber')).toBe('NaN')
            expect(numberFormat(undefined)).toBe('0')
        })

        it('should handle edge cases with decimals greater than available digits', () => {
            expect(numberFormat('12345.6', 3, true)).toBe('12345.600')
            expect(numberFormat('12345', 2, true)).toBe('12345.00')
        })

        it('should be an alias of numberFormat', () => {
            expect(numberFormat === toPrice).toBe(true)
        })

        it('should handle numbers starting with a decimal point', () => {
            const result = numberFormat('.5', 2, true)
            expect(result).toBe('0.50')

            const result2 = numberFormat('.123', 2)
            expect(result2).toBe('0.12') // Tronque à deux décimales
        })

        it('should handle numbers starting with a decimal point and no decimals specified', () => {
            const result = numberFormat('.5', 0)
            expect(result).toBe('1')
        })
    })

    describe('pad()', () => {
        it('should pad a string to the left by default', () => {
            expect(pad('42', 5)).toBe('   42')
        })

        it('should pad a string to the left with a custom character', () => {
            expect(pad('42', 5, '0')).toBe('00042')
        })

        it('should pad a string to the right with a custom character', () => {
            expect(pad('42', 5, '0', 'right')).toBe('42000')
        })

        it('should not pad a string if its length is already equal to or greater than pad_length', () => {
            expect(pad('hello', 5)).toBe('hello')
        })

        it('should handle multi-character padding strings', () => {
            expect(pad('42', 8, '_+')).toBe('_+_+_+42')
            expect(pad('42', 8, '_+', 'right')).toBe('42_+_+_+')
        })

        it('should handle empty strings', () => {
            expect(pad('', 5)).toBe('     ')
            expect(pad('', 5, '0')).toBe('00000')
        })

        it('should handle invalid pad_length gracefully', () => {
            expect(pad('42', undefined)).toBe('42')
            expect(pad('42', null)).toBe('42')
        })

        it('should handle non-default pad_type values gracefully', () => {
            expect(pad('42', 5, '0', 'invalid')).toBe('42')
        })

        it('should handle long padding strings correctly', () => {
            expect(pad('42', 10, 'abcdef')).toBe('abcdefab42')
            expect(pad('42', 10, 'abcdef', 'right')).toBe('42abcdefab')
        })

        it('should handle special characters in padding string', () => {
            expect(pad('42', 5, '*')).toBe('***42')
            expect(pad('42', 5, ' ', 'right')).toBe('42   ')
        })
    })

    describe('rgb2hex()', () => {
        it('should convert numeric RGB values to a hexadecimal string', () => {
            expect(rgb2hex(255, 0, 0)).toBe('FF0000')
            expect(rgb2hex(0, 255, 0)).toBe('00FF00')
            expect(rgb2hex(0, 0, 255)).toBe('0000FF')
            expect(rgb2hex(255, 255, 255)).toBe('FFFFFF')
            expect(rgb2hex(0, 0, 0)).toBe('000000')
        })

        it('should handle an array of RGB values as input', () => {
            expect(rgb2hex([255, 0, 0])).toBe('FF0000')
            expect(rgb2hex([0, 255, 0])).toBe('00FF00')
            expect(rgb2hex([0, 0, 255])).toBe('0000FF')
            expect(rgb2hex([255, 255, 255])).toBe('FFFFFF')
            expect(rgb2hex([0, 0, 0])).toBe('000000')
        })

        it('should handle numeric strings as RGB values', () => {
            expect(rgb2hex('255', '0', '0')).toBe('FF0000')
            expect(rgb2hex('0', '255', '0')).toBe('00FF00')
            expect(rgb2hex('0', '0', '255')).toBe('0000FF')
            expect(rgb2hex('255', '255', '255')).toBe('FFFFFF')
            expect(rgb2hex('0', '0', '0')).toBe('000000')
        })

        it('should return an empty string for invalid inputs', () => {
            expect(rgb2hex(null)).toBe('')
            expect(rgb2hex(undefined)).toBe('')
            expect(rgb2hex('invalid', 255, 255)).toBe('')
            expect(rgb2hex(255, 'invalid', 255)).toBe('')
            expect(rgb2hex(255, 255, 'invalid')).toBe('')
        })

        it('should handle mixed input types', () => {
            expect(rgb2hex(255, '255', 255)).toBe('FFFFFF')
            expect(rgb2hex('0', 0, '0')).toBe('000000')
        })

        it('should handle edge cases like single-channel RGB', () => {
            expect(rgb2hex(0, 0, 0)).toBe('000000')
            expect(rgb2hex(255, 255, 255)).toBe('FFFFFF')
        })
    })

    describe('hex2rgb()', () => {
        it('should convert a valid hexadecimal color string to an RGB array', () => {
            expect(hex2rgb('#FF0000')).toEqual([255, 0, 0])
            expect(hex2rgb('#00FF00')).toEqual([0, 255, 0])
            expect(hex2rgb('#0000FF')).toEqual([0, 0, 255])
            expect(hex2rgb('#FFFFFF')).toEqual([255, 255, 255])
            expect(hex2rgb('#000000')).toEqual([0, 0, 0])
        })

        it('should handle hexadecimal colors without the leading "#" character', () => {
            expect(hex2rgb('FF0000')).toEqual([255, 0, 0])
            expect(hex2rgb('00FF00')).toEqual([0, 255, 0])
            expect(hex2rgb('0000FF')).toEqual([0, 0, 255])
        })

        it('should handle mixed-case hexadecimal strings', () => {
            expect(hex2rgb('#ff0000')).toEqual([255, 0, 0])
            expect(hex2rgb('00FF00')).toEqual([0, 255, 0])
            expect(hex2rgb('Aa00FF')).toEqual([170, 0, 255])
        })

        it('should handle shorthand hexadecimal colors (e.g., #F00)', () => {
            expect(hex2rgb('#F00')).toEqual([255, 0, 0])
            expect(hex2rgb('#0F0')).toEqual([0, 255, 0])
            expect(hex2rgb('#00F')).toEqual([0, 0, 255])
        })

        it('should return an empty array for invalid hexadecimal strings', () => {
            expect(hex2rgb('')).toEqual([])
            expect(hex2rgb('#XYZ123')).toEqual([])
            expect(hex2rgb('GGG')).toEqual([])
            expect(hex2rgb('#FFFFFG')).toEqual([])
        })

        it('should return an empty array for non-string inputs', () => {
            expect(hex2rgb(null)).toEqual([])
            expect(hex2rgb(undefined)).toEqual([])
            expect(hex2rgb(123)).toEqual([])
            expect(hex2rgb({})).toEqual([])
            expect(hex2rgb([])).toEqual([])
        })
    })

    describe('parse_url()', () => {
        it('should parse a full URL into its components', () => {
            const url = 'https://user:pass@host.com:80/path/to?param=value#fragment'
            const result = parse_url(url)

            expect(result).toEqual({
                scheme: 'https',
                user: 'user',
                pass: 'pass',
                host: 'host.com',
                port: '80',
                path: '/path/to',
                query: 'param=value',
                fragment: 'fragment',
            })
        })
    })

    describe('addUrlParam()', () => {
        it('should add a single parameter to a URL without a query string', () => {
            const url = 'https://example.com'
            const result = addUrlParam(url, 'key', 'value')
            expect(result).toBe('https://example.com?key=value')
        })

        it('should add a single parameter to a URL with an existing query string', () => {
            const url = 'https://example.com?existing=param'
            const result = addUrlParam(url, 'key', 'value')
            expect(result).toBe('https://example.com?existing=param&key=value')
        })

        it('should overwrite an existing parameter with the same key', () => {
            const url = 'https://example.com?key=oldValue'
            const result = addUrlParam(url, 'key', 'newValue')
            expect(result).toBe('https://example.com?key=newValue')
        })

        it('should handle URLs with fragments (hashes)', () => {
            const url = 'https://example.com?existing=param#section'
            const result = addUrlParam(url, 'key', 'value')
            expect(result).toBe('https://example.com?existing=param&key=value#section')
        })

        it('should add multiple parameters from an object', () => {
            const url = 'https://example.com'
            const params = { key1: 'value1', key2: 'value2' }
            const result = addUrlParam(url, params)
            expect(result).toBe('https://example.com?key1=value1&key2=value2')
        })

        it('should handle a URL without a scheme and host', () => {
            const url = '/path/to/resource'
            const result = addUrlParam(url, 'key', 'value')
            expect(result).toBe('/path/to/resource?key=value')
        })

        it('should handle a URL with an existing parameter and without a scheme and host', () => {
            const url = '/path/to/resource?existing=param'
            const result = addUrlParam(url, 'key', 'value')
            expect(result).toBe('/path/to/resource?existing=param&key=value')
        })

        it('should handle a URL with an existing parameter and a new one', () => {
            const url = 'https://example.com?existing=param'
            const result = addUrlParam(url, { existing: 'newParam', another: 'value' })
            expect(result).toBe('https://example.com?existing=newParam&another=value')
        })

        it('should handle a null value for a parameter', () => {
            const url = 'https://example.com'
            const result = addUrlParam(url, 'key', null)
            expect(result).toBe('https://example.com?key=')
        })

        it('should handle an empty string as a parameter value', () => {
            const url = 'https://example.com'
            const result = addUrlParam(url, 'key', '')
            expect(result).toBe('https://example.com?key=')
        })

        it('should not alter the original URL if no parameters are provided', () => {
            const url = 'https://example.com'
            const result = addUrlParam(url, {})
            expect(result).toBe('https://example.com')
        })

        it('should handle adding parameters to a relative URL with a hash', () => {
            const url = '/path/to/resource#section'
            const result = addUrlParam(url, 'key', 'value')
            expect(result).toBe('/path/to/resource?key=value#section')
        })
    })

    describe('decodeHtml(), htmlquotes(), htmlsimplequotes()', () => {
        it('should decode html entities', () => {
            expect(decodeHtml(str7)).toBe('&<>"\'')
        })

        it('should encode double and simple quotes', () => {
            expect(htmlquotes('"\'')).toBe('&quot;&#039;')
        })

        it('should encode simple quotes', () => {
            expect(htmlsimplequotes('"\'')).toBe('"&#039;')
        })

        it('should return an empty string when the string is null or undefined', () => {
            expect(decodeHtml(null)).toBe('')
            expect(htmlquotes(undefined)).toBe('')
            expect(htmlsimplequotes(null)).toBe('')
            expect(decodeHtml(undefined)).toBe('')
            expect(htmlquotes(null)).toBe('')
            expect(htmlsimplequotes(undefined)).toBe('')
        })
    })

    describe('repeat', () => {
        it('should repeat the string n times', () => {
            expect(repeat('abc', 3)).toBe('abcabcabc')
        })

        it('should return an empty string when n is 0', () => {
            expect(repeat('abc', 0)).toBe('')
        })

        it('should return an empty string when n is negative', () => {
            expect(repeat('abc', -1)).toBe('')
        })

        it('should work with an empty string', () => {
            expect(repeat('', 5)).toBe('')
        })

        it('should repeat single characters correctly', () => {
            expect(repeat('a', 5)).toBe('aaaaa')
        })

        it('should return an empty string when n is not a number', () => {
            expect(repeat('abc', null)).toBe('')
            expect(repeat('abc', undefined)).toBe('')
            expect(repeat('abc', 'not-a-number')).toBe('')
        })

        it('should handle n as a float by truncating it', () => {
            expect(repeat('abc', 3.7)).toBe('abcabcabc')
        })

        it('should return an empty string when the string is null or undefined', () => {
            expect(repeat(null, 3)).toBe('')
            expect(repeat(undefined, 3)).toBe('')
        })
    })

    describe('stripTags()', () => {
        it('should remove a specific tag and keep its content', () => {
            const input = '<p>Hello <b>world</b></p>'
            const result = stripTags(input, 'b')
            expect(result).toBe('<p>Hello world</p>')
        })

        it('should remove nested instances of a specific tag', () => {
            const input = '<div><span>Hello <span>world</span></span></div>'
            const result = stripTags(input, 'span')
            expect(result).toBe('<div>Hello world</div>')
        })

        it('should remove all tags if no specific tag is provided', () => {
            const input = '<p>Hello <b>world</b></p>'
            const result = stripTags(input)
            expect(result).toBe('Hello world')
        })

        it('should handle self-closing tags correctly', () => {
            const input = '<img src="image.jpg" /><p>Text</p>'
            const result = stripTags(input)
            expect(result).toBe('Text')
        })

        it('should handle tags with attributes', () => {
            const input = '<a href="https://example.com">Link</a>'
            const result = stripTags(input, 'a')
            expect(result).toBe('Link')
        })

        it('should handle invalid HTML gracefully', () => {
            const input = '<div><p>Unclosed div'
            const result = stripTags(input)
            expect(result).toBe('Unclosed div')
        })

        it('should return the string as-is if no tags are present', () => {
            const input = 'No tags here'
            const result = stripTags(input)
            expect(result).toBe('No tags here')
        })

        it('should remove multiple instances of the same tag', () => {
            const input = '<b>Hello</b> <b>world</b>'
            const result = stripTags(input, 'b')
            expect(result).toBe('Hello world')
        })

        it('should be case-insensitive for tags', () => {
            const input = '<B>Hello</B> <b>world</b>'
            const result = stripTags(input, 'b')
            expect(result).toBe('Hello world')
        })

        it('should handle empty strings gracefully', () => {
            const input = ''
            const result = stripTags(input)
            expect(result).toBe('')
        })

        it('should not throw an error if the tag is null or undefined', () => {
            const input = '<p>Hello</p>'
            expect(stripTags(input, null)).toBe('Hello')
            expect(stripTags(input, undefined)).toBe('Hello')
        })

        it('should not remove content when the tag does not match', () => {
            const input = '<p>Hello <b>world</b></p>'
            const result = stripTags(input, 'div')
            expect(result).toBe('<p>Hello <b>world</b></p>')
        })
    })

    describe('toUrl()', () => {
        it('should convert a string to lowercase', () => {
            expect(toUrl(str1)).toBe('on-en-a-gros')
        })

        it('should remove accents, special characters', () => {
            expect(toUrl('Élève')).toBe('eleve')
            expect(toUrl('Hello@World!')).toBe('hello-world')
            expect(toUrl('@@##$$')).toBe('')
        })

        it('should replace multiple consecutive dashes with a single dash', () => {
            expect(toUrl('Hello   World')).toBe('hello-world')
            expect(toUrl('Hello---World')).toBe('hello-world')
        })

        it('should trim leading and trailing dashes', () => {
            expect(toUrl('-Hello World-')).toBe('hello-world')
        })

        it('should handle empty strings', () => {
            expect(toUrl('')).toBe('')
        })

        it('should handle strings with mixed cases, accents, and special characters', () => {
            expect(toUrl("Élève à l'école")).toBe('eleve-a-l-ecole')
        })

        it('should handle numeric characters correctly', () => {
            expect(toUrl('Product 123')).toBe('product-123')
        })

        it('should handle strings with underscores and hyphens', () => {
            expect(toUrl('Hello_World')).toBe('hello-world')
            expect(toUrl('Hello-World')).toBe('hello-world')
        })
    })

    describe('escapeRegex()', () => {
        it('should escape special regex characters', () => {
            const input = '.*+?^${}()|[]\\'
            const output = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\'
            expect(escapeRegex(input)).toBe(output)
        })

        it('should escape spaces correctly', () => {
            const input = 'Hello World'
            const output = 'Hello\\ World'
            expect(escapeRegex(input)).toBe(output)
        })

        it('should handle strings with mixed characters', () => {
            const input = 'a+b*c?d.e^f|g(h)i[j]k\\l'
            const output = 'a\\+b\\*c\\?d\\.e\\^f\\|g\\(h\\)i\\[j\\]k\\\\l'
            expect(escapeRegex(input)).toBe(output)
        })

        it('should return the same string if no special characters are present', () => {
            const input = 'simpletext'
            expect(escapeRegex(input)).toBe(input)
        })

        it('should handle an empty string', () => {
            const input = ''
            const output = ''
            expect(escapeRegex(input)).toBe(output)
        })

        it('should escape special characters in numeric strings', () => {
            const input = '123$456'
            const output = '123\\$456'
            expect(escapeRegex(input)).toBe(output)
        })

        it('should escape multiple spaces', () => {
            const input = 'Hello   World'
            const output = 'Hello\\ \\ \\ World'
            expect(escapeRegex(input)).toBe(output)
        })

        it('should handle special characters at the start and end of the string', () => {
            const input = '*Hello World?'
            const output = '\\*Hello\\ World\\?'
            expect(escapeRegex(input)).toBe(output)
        })

        it('should escape newlines and tabs as spaces', () => {
            const input = 'Hello\nWorld\t!'
            const output = 'Hello\\ World\\ !'
            expect(escapeRegex(input)).toBe(output)
        })
    })

    describe('camelCase()', () => {
        it('should convert a string with underscores to camelCase', () => {
            expect(camelCase('hello_world')).toBe('helloWorld')
        })

        it('should convert a string with dashes to camelCase', () => {
            expect(camelCase('hello-world')).toBe('helloWorld')
        })

        it('should convert a string with mixed dashes and underscores to camelCase', () => {
            expect(camelCase('hello-world_and_underscore')).toBe('helloWorldAndUnderscore')
        })

        it('should handle strings with multiple consecutive separators', () => {
            expect(camelCase('hello__world--test')).toBe('helloWorldTest')
        })

        it('should handle strings with leading separators', () => {
            expect(camelCase('_hello_world')).toBe('helloWorld')
            expect(camelCase('-hello-world')).toBe('helloWorld')
        })

        it('should handle strings with trailing separators', () => {
            expect(camelCase('hello_world_')).toBe('helloWorld')
            expect(camelCase('hello-world-')).toBe('helloWorld')
        })

        it('should convert a single word to lowercase', () => {
            expect(camelCase('HELLO')).toBe('hello')
            expect(camelCase('hello')).toBe('hello')
        })

        it('should handle empty strings', () => {
            expect(camelCase('')).toBe('')
        })

        it('should handle strings with no separators', () => {
            expect(camelCase('simpleword')).toBe('simpleword')
        })

        it('should handle strings with numeric characters', () => {
            expect(camelCase('version-1_2')).toBe('version12')
        })

        it('should handle strings with special characters outside separators', () => {
            expect(camelCase('hello@world')).toBe('hello@world')
        })

        it('should handle spaces', () => {
            expect(camelCase('  hello world  ')).toBe('helloWorld')
        })

        it('should handle mixed case strings', () => {
            expect(camelCase('HeLLo-WoRLd')).toBe('heLloWoRld')
        })

        it('should handle camelCase strings', () => {
            expect(camelCase('helloWorld')).toBe('helloWorld')
        })
    })

    describe('format()', () => {
        it('should replace indexed placeholders with corresponding arguments', () => {
            const result = format('Hello {0}, welcome to {1}!', 'Alice', 'Wonderland')
            expect(result).toBe('Hello Alice, welcome to Wonderland!')
        })

        it('should leave placeholders intact if no corresponding argument is provided', () => {
            const result = format('Hello {0}, welcome to {1}!', 'Alice')
            expect(result).toBe('Hello Alice, welcome to {1}!')
        })

        it('should handle objects as the first argument', () => {
            const result = format('Hello {name}, welcome to {place}!', {
                name: 'Alice',
                place: 'Wonderland',
            })
            expect(result).toBe('Hello Alice, welcome to Wonderland!')
        })

        it('should prioritize indexed placeholders over object replacements', () => {
            const result = format('Hello {0}, welcome to {place}!', 'Alice', {
                place: 'Wonderland',
            })
            expect(result).toBe('Hello Alice, welcome to Wonderland!')
        })

        it('should handle objects with numeric keys as placeholders', () => {
            const result = format('Values: {0}, {1}, {key}', { 0: 'zero', 1: 'one', key: 'value' })
            expect(result).toBe('Values: zero, one, value')
        })

        it('should leave unmatched placeholders intact', () => {
            const result = format('Hello {name}, welcome to {place}!', { name: 'Alice' })
            expect(result).toBe('Hello Alice, welcome to {place}!')
        })

        it('should handle empty strings', () => {
            const result = format('')
            expect(result).toBe('')
        })

        it('should return the original string if no replacements are provided', () => {
            const result = format('Hello {0}')
            expect(result).toBe('Hello {0}')
        })

        it('should handle undefined or null values in objects', () => {
            const result = format('Value: {key}', { key: undefined })
            expect(result).toBe('Value: {key}')
        })

        it('should handle special characters in object keys', () => {
            const result = format('Hello {user-name}!', { 'user-name': 'Alice' })
            expect(result).toBe('Hello Alice!')
        })

        it('should handle placeholders with numeric keys as strings', () => {
            const result = format('Value: {0}', { 0: 'zero' })
            expect(result).toBe('Value: zero')
        })
    })

    describe('toCssClassName()', () => {
        it('should replace spaces with hyphens', () => {
            expect(toCssClassName('hello world')).toBe('hello-world')
        })

        it('should encode special characters as hexadecimal', () => {
            expect(toCssClassName('hello@world')).toBe('hello__0040world')
        })

        it('should encode non-ASCII characters as hexadecimal', () => {
            expect(toCssClassName('café')).toBe('caf__00e9')
        })

        it('should return an empty string when input is empty', () => {
            expect(toCssClassName('')).toBe('')
        })

        it('should leave valid CSS characters unchanged', () => {
            expect(toCssClassName('valid-class_name')).toBe('valid-class_name')
        })

        it('should encode numbers as they are valid CSS class name characters', () => {
            expect(toCssClassName('123')).toBe('123')
        })

        it('should encode edge-case characters', () => {
            expect(toCssClassName('$hello&world')).toBe('__0024hello__0026world')
        })

        it('should handle strings with only special characters', () => {
            expect(toCssClassName('@@@')).toBe('__0040__0040__0040')
        })

        it('should handle a string with spaces only', () => {
            expect(toCssClassName('   ')).toBe('---')
        })
    })

    describe('compareMixAlphaDigits', () => {
        it('should compare purely alphabetic strings', () => {
            expect(compareMixAlphaDigits('abc', 'abd')).toBe(-1)
            expect(compareMixAlphaDigits('abd', 'abc')).toBe(1)
            expect(compareMixAlphaDigits('abc', 'abc')).toBe(0)
        })

        it('should compare strings with digits at the start', () => {
            expect(compareMixAlphaDigits('12abc', '9abc')).toBe(1)
            expect(compareMixAlphaDigits('9abc', '12abc')).toBe(-1)
            expect(compareMixAlphaDigits('12abc', '12abc')).toBe(0)
        })

        it('should compare strings with digits in the middle', () => {
            expect(compareMixAlphaDigits('abc12', 'abc9')).toBe(1)
            expect(compareMixAlphaDigits('abc9', 'abc12')).toBe(-1)
            expect(compareMixAlphaDigits('abc12', 'abc12')).toBe(0)
        })

        it('should compare strings with digits in different positions', () => {
            expect(compareMixAlphaDigits('a12bc', '12abc')).toBe(1)
            expect(compareMixAlphaDigits('12abc', 'a12bc')).toBe(-1)
        })

        it('should compare strings with digits and different alphabetic prefixes', () => {
            expect(compareMixAlphaDigits('abc12', 'abd12')).toBe(-1)
            expect(compareMixAlphaDigits('abd12', 'abc12')).toBe(1)
        })

        it('should handle empty strings', () => {
            expect(compareMixAlphaDigits('', 'abc')).toBe(-1)
            expect(compareMixAlphaDigits('abc', '')).toBe(1)
            expect(compareMixAlphaDigits('', '')).toBe(0)
        })

        it('should handle strings with digits', () => {
            expect(compareMixAlphaDigits('123a', '45')).toBe(1)
            expect(compareMixAlphaDigits('123', '123')).toBe(0)
            expect(compareMixAlphaDigits('1230', '421')).toBe(1)
            expect(compareMixAlphaDigits('421', '1230')).toBe(-1)
            expect(compareMixAlphaDigits('0421', '421')).toBe(0)
        })

        it('should handle mixed cases with letters and digits', () => {
            expect(compareMixAlphaDigits('45', '123a')).toBe(-1)
            expect(compareMixAlphaDigits('a1b2', 'a1b10')).toBe(-1)
            expect(compareMixAlphaDigits('a1b10', 'a1b2')).toBe(1)
            expect(compareMixAlphaDigits('a1b2', 'a1b2')).toBe(0)
            expect(compareMixAlphaDigits('a130b', 'a14a')).toBe(1)
        })
    })

    describe('formatSize', () => {
        it('should return size in kilobytes for values less than 1 kB', () => {
            expect(formatSize(512)).toBe('0,5 kB')
        })

        it('should return size in kilobytes for values >= 1 kB and < 1 MB', () => {
            expect(formatSize(1536)).toBe('1,5 kB')
        })

        it('should return size in megabytes for values >= 1 MB and < 1 GB', () => {
            expect(formatSize(1048576)).toBe('1 MB')
        })

        it('should return size in gigabytes for values >= 1 GB', () => {
            expect(formatSize(1073741824)).toBe('1 GB')
        })

        it('should handle custom decimal point', () => {
            expect(formatSize(1536, '.')).toBe('1.5 kB')
        })

        it('should handle edge case of exactly 1024 bytes', () => {
            expect(formatSize(1024)).toBe('1 kB')
        })

        it('should handle 0 bytes', () => {
            expect(formatSize(0)).toBe('0 kB')
        })

        it('should use appropriate decimals for non-integers', () => {
            expect(formatSize(1049600)).toBe('1,0 MB')
        })
    })

    describe('hilite', () => {
        it('should highlight a single match with default tag', () => {
            const str = "Moi j'ai appris à lire, ben je souhaite ça à personne."
            const req = 'appris à lire'
            const result = hilite(str, req)
            expect(result).toBe(
                "Moi j'ai <strong>appris à lire</strong>, ben je souhaite ça à personne.",
            )
        })

        it('should highlight multiple matches with default tag', () => {
            const str =
                "Hé ! Toi là-bas ! Avec ton casque à cornes … Présente-moi ta femme, comme ça tu sauras pourquoi t'as des cornes !"
            const req = 'cornes'
            const result = hilite(str, req)
            expect(result).toBe(
                "Hé ! Toi là-bas ! Avec ton casque à <strong>cornes</strong> … Présente-moi ta femme, comme ça tu sauras pourquoi t'as des <strong>cornes</strong> !",
            )
        })

        it('should ignore case and accents', () => {
            const str =
                "Vous vous étonnerez pas si vous ressentez une vive douleur sur le sommet du CrâNe. C'est sûrement que vous aurez pris le plat à gigot dans la tronche !"
            const req = 'crane'
            const result = hilite(str, req)
            expect(result).toBe(
                "Vous vous étonnerez pas si vous ressentez une vive douleur sur le sommet du <strong>CrâNe</strong>. C'est sûrement que vous aurez pris le plat à gigot dans la tronche !",
            )
        })

        it('should allow a custom tag', () => {
            const str = "Le gras, c'est la vie."
            const req = 'gras'
            const result = hilite(str, req, 'b')
            expect(result).toBe("Le <b>gras</b>, c'est la vie.")
        })

        it('should handle multiple words to highlight', () => {
            const str =
                "J'irai me coucher quand vous m'aurez juré qu'il n'y a pas dans cette forêt d'animal plus dangereux que le lapin adulte !"
            const req = ['coucher', 'foret', 'lapin']
            const result = hilite(str, req)
            expect(result).toBe(
                "J'irai me <strong>coucher</strong> quand vous m'aurez juré qu'il n'y a pas dans cette <strong>forêt</strong> d'animal plus dangereux que le <strong>lapin</strong> adulte !",
            )
        })

        it('should return the original string if no matches', () => {
            const str =
                "La politique de l'autruche, c'est une politique qui court vite, une politique qui fait des gros oeufs."
            const req = 'arthur'
            const result = hilite(str, req)
            expect(result).toBe(
                "La politique de l'autruche, c'est une politique qui court vite, une politique qui fait des gros oeufs.",
            )
        })

        it('should return the original string if req is empty', () => {
            const str = 'On en a gros !'
            const req = ''
            const result = hilite(str, req)
            expect(result).toBe('On en a gros !')
        })

        it('should not break with special characters in req', () => {
            const str = "c\'est pas faux"
            const req = "c\'est"
            const result = hilite(str, req)
            expect(result).toBe("<strong>c\'est</strong> pas faux")
        })
    })
})
