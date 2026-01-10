import {isArray, isFloat, isInteger, isObject, isPlainObject, isString, isUndefined} from "./is.js";
import {dec2hex, hex2dec, round} from "./math.js";
import {inArray} from "./array.js";
import {each, foreach, map} from "./traversal.js";
// import {translate} from "./Translator.js";

export const trim = function (str, char = '\\s') {
    return ltrim(rtrim(str, char), char);
}

export const ltrim = function (str, char = '\\s') {
    return str.replace(new RegExp(`^${char}+`, 'g'), '');
}

export const rtrim = function (str, char = '\\s') {
    return str.replace(new RegExp(`${char}+$`, 'g'), '');
}

export const stripMultipleSpaces = function(str) {
    return str.trim().replace(/ +/g, ' ');
}

export const noAccent = function(str) {
    return str
        .replace(/[àäâ]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[îïí]/g, 'i')
        .replace(/[öô]/g, 'o')
        .replace(/[üù]/g, 'u')
        .replace(/ç/g, 'c')
        .replace(/ÿ/g, 'y')
        .replace(/[ÀÄÂ]/g, 'A')
        .replace(/[ÈÉÊË]/g, 'E')
        .replace(/[ÎÏÍ]/g, 'I')
        .replace(/[ÖÔ]/g, 'O')
        .replace(/[ÜÙ]/g, 'U')
        .replace(/Ç/g, 'C')
        .replace(/Ÿ/g, 'Y');
}

export const br2nl = function(str) {
    return str.split(/<br\s*\/*>/).join('\n');
}

export const nl2br = function(str) {
    return str.split('\n').join('<br>');
}

export const ucfirst = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const lcfirst = function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export const insertTag = function(str, tag, position = 0, length = 0) {
    let startTag = `<${tag}>`
    let endTag = `</${tag}>`

    if (['br', 'hr', 'img', 'link', 'input'].includes(tag)) {
        startTag = `<${tag}/>`;
        endTag = '';
    }

    return str.slice(0, position) + startTag + str.slice(position, position + length) + endTag + str.slice(position + length);
}

export const substringIndex = function(str, delimiter, index)
{
    let input = str + '',
        arr = input.split(delimiter);

    if (index > 0) {
        arr.splice(index, arr.length - index);
    } else if (index < 0) {
        arr.splice(0, arr.length + index);
    }

    return arr.join(delimiter);
}

export const insert = (str, ins, n) => {
    if (n >= str.length) {
        return str;
    }

    return [...str].reduce((newStr, char, index) => {
        if (index > 0 && index % n === 0) {
            return newStr + ins + char;
        }

        return newStr + char;
    }, '');
}

export const reverse = function(str) {
    let res = [];

    for (let i = 0; i < str.length; i++) {
        res.unshift(str[i]);
    }

    return res.join('');
}

export const thousandSeparator = function(value, separator = '.', pointDecimal = '.') {
    if (isUndefined(value) || null === value) {
        return value;
    }

    value = (value + '').replace(',', '.');

    if (Math.abs(value) >= 1000) {
        let intval = Math[value >= 1000 ? 'floor' : 'ceil'](value) + '';
        let newval = reverse(insert(reverse(intval), reverse(separator), 3));

        return value.indexOf('.') > 0 ? newval + pointDecimal + substringIndex(value, '.' ,-1) : newval;
    }

    return (value + '').replace('.', pointDecimal);
}

export const numberFormat = function(number, decimals = 2, forceCentimes = false, thousandSep = '', pointDecimal = '.') {
    number = number ? number + '' : '0';
    number = round(parseFloat(number.replace(',', '.')), decimals) + '';

    if (decimals === 0) {
        return thousandSeparator(number, thousandSep, pointDecimal);
    }

    const pos = number.lastIndexOf('.');

    if (-1 === pos) {
        if (true === forceCentimes) {
            number += pointDecimal + repeat('0', decimals);
        }

        return thousandSeparator(number, thousandSep, pointDecimal);
    }

    const digits = number.slice(pos + 1);
    const nbDigits = digits.length;
    if (decimals > nbDigits) {
        return thousandSeparator(number + '0'.repeat(decimals - nbDigits), thousandSep, pointDecimal);
    }

    return thousandSeparator(number.slice(0, pos + 1 + decimals), thousandSep, pointDecimal);
}

export const toPrice = numberFormat;

/**
 * Pads a string to a specified length with a specified string and padding type
 *
 * @param {string} str
 * @param {number} pad_length
 * @param {string} [pad_str]
 * @param {string} [pad_type]
 * @returns {string}
 */
export const pad = function(str, pad_length, pad_str = ' ', pad_type = 'left') {
    if (isUndefined(pad_length) || str.length >= pad_length || !inArray(pad_type, ['left', 'right'])) {
        return str;
    }

    if (pad_type === 'left') {
        return pad_str.repeat(Math.ceil(pad_length / pad_str.length)).slice(0, pad_length - str.length) + str;
    }

    return str + pad_str.repeat(Math.ceil(pad_length / pad_str.length)).slice(0, pad_length - str.length);
}

/**
 * Converts RGB values to a hexadecimal color string.
 *
 * @param {number|number[]} r - Either an array representing a RGB color (e.g. [255, 0, 0]) or the red component as a
 *                              number (0-255).
 * @param {number} [g] - The green component (0-255). Required if `r` is a number.
 * @param {number} [b] - The blue component (0-255). Required if `r` is a number.
 * @returns {string} The hexadecimal color string (e.g., 'FF0000').
 *
 * @example
 * // Using separate RGB components
 * rgb2hex(255, 0, 0); // Returns 'FF0000'
 *
 * @example
 * // Using an array of RGB components
 * rgb2hex([255, 0, 0]); // Returns 'FF0000'
 */
export const rgb2hex = function(r, g, b) {
    if (isArray(r)) {
        return rgb2hex(...r);
    }

    if (!isInteger(r) || !isInteger(g) || !isInteger(b)) return '';

    return [
        pad(dec2hex(parseInt(r)), 2, '0').toUpperCase(),
        pad(dec2hex(parseInt(g)), 2, '0').toUpperCase(),
        pad(dec2hex(parseInt(b)), 2, '0').toUpperCase(),
    ].join('')
}

export const rgbtohex = rgb2hex

/**
 * Converts a hexadecimal color to RGB values.
 *
 * @param {string} hex - The hexadecimal value (e.g #FF0000)
 * @returns {number[]} The RGB color array (e.g [255, 0, 0]).
 */
export const hex2rgb = function(hex) {
    if (!isString(hex) || !hex.length) return [];

    hex = hex.slice(-6).toUpperCase();

    if (hex.length < 6) {
        hex = map(hex.slice(-3), (i, h) => h + '' + h).join('');
    }

    for (let i = 0; i < hex.length; i++) {
        if (-1 === '0123456789ABCDEF'.indexOf(hex[i])) {
            return [];
        }
    }

    return map(insert(hex, ',', 2).split(','), (i, h) => hex2dec(h))
}

export const hextorgb = hex2rgb

/**
 * Parses a URL string into its components.
 *
 * @param {string} str - The URL string to be parsed.
 * @returns {Object} An object containing the parsed components of the URL.
 *
 * @property {string} [scheme] - The scheme (protocol) of the URL (e.g., `http`, `https`).
 * @property {string} [authority] - The authority part of the URL.
 * @property {string} [userInfo] - The user information (e.g., `user:pass`).
 * @property {string} [user] - The username from the user information.
 * @property {string} [pass] - The password from the user information.
 * @property {string} [host] - The host of the URL (e.g., `example.com`).
 * @property {string} [port] - The port of the URL (e.g., `8080`).
 * @property {string} [relative] - The relative URL.
 * @property {string} [path] - The path of the URL (e.g., `/path/to/resource`).
 * @property {string} [directory] - The directory of the URL path.
 * @property {string} [file] - The file name from the path, if applicable.
 * @property {string} [query] - The query string (e.g., `key=value&key2=value2`).
 * @property {string} [fragment] - The fragment (hash) of the URL (e.g., `#section`).
 */
export const parse_url = function(str) {
    const
        key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'],
        parser = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;

    const m = parser.exec(str);
    let uri = {}, i = 14;

    while (i--) {
        if (m[i]) {
            uri[key[i]] = m[i];
        }
    }

    delete uri.source;
    return uri;
}

/**
 * Adds or updates one or more query parameters to a given URL.
 *
 * @param {string} url - The URL to which the parameters should be added.
 * @param {string|Object} param - The key of the parameter to add, or an object containing multiple key-value pairs to add.
 * @param {string|null} [value=null] - The value of the parameter to add. Ignored if `param` is an object.
 * @returns {string} The updated URL with the new query parameters.
 *
 * @example <caption>Add a single parameter to a URL without a query string</caption>
 * addUrlParam('https://example.com', 'key', 'value');
 * // Returns: 'https://example.com?key=value'
 *
 * @example <caption>Add multiple parameters to a URL</caption>
 * addUrlParam('https://example.com', { key1: 'value1', key2: 'value2' });
 * // Returns: 'https://example.com?key1=value1&key2=value2'
 */
export const addUrlParam = function(url, param, value = null) {
    if (isPlainObject(param)) {
        each(param, (key, val) => {
            url = addUrlParam(url, key, val);
        });

        return url;
    }

    let parseUrl = parse_url(url), pos, hash = "";

    if ((pos = url.indexOf("#")) > -1) {
        hash = url.slice(pos);
        url = url.slice(0, pos);
    }

    const key = encodeURIComponent(param);
    const val = value === null ? '' : encodeURIComponent(value);

    if (!parseUrl.query) {
        return url + "?" + key + "=" + val + hash;
    }

    const params = parseUrl.query.split('&');
    let param_exists = false;

    for (let i = 0; i < params.length; i++) {
        if (params[i].startsWith(key + "=")) {
            params[i] = key + "=" + val;
            param_exists = true;
            break;
        }
    }

    if (!param_exists) {
        params.push(key + "=" + val);
    }

    if (parseUrl.scheme && parseUrl.host) {
        return parseUrl.scheme + '://' + parseUrl.host + (parseUrl.path || '') + "?" + params.join("&") + hash;
    }

    return (parseUrl.host || '') + parseUrl.path + "?" + params.join("&") + hash;
}

export const decodeHtml = function(str) {
    if (!isString(str))
        return '';

    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

export const htmlquotes = function(str) {
    if (!isString(str))
        return '';

    return str
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export const htmlsimplequotes = function(str) {
    if (!isString(str))
        return '';

    return str.replace(/'/g, "&#039;");
}

export const repeat = function(str, n) {
    if (!isString(str) || !isFloat(n))
        return '';

    return new Array(Math.floor(n) + 1).join(str);
}

export const stripTags = function(str, tag) {
    if (isString(tag)) {
        const rStripTags = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>|<${tag}[^>]*\/>`, 'ig');

        while (rStripTags.test(str))
            str = str.replace(rStripTags, '$1');

        return str;
    }

    return str.replace(/(<([^>]+)>)/ig,"");
}

export const toUrl = function(str) {
    return trim(noAccent(str).toLowerCase()
        .replace(/[^a-z0-9]/g,'-')
        .replace(/-{2,}/g,'-'),
    '-')
}

/**
 * @see http://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
 */
export const escapeRegex = function(str) {
    return str
        .replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        .replace(/[\n\t]/g, " ");
}

export const camelCase = function(str) {
    if (!str) return '';

    let prev = '';
    let prevReplaced = false;
    let prevIsSeparator = false;
    let prevIsUpperCase = false;

    str = trim(str);
    str = trim(str, '_');
    str = trim(str, '-');

    const isUpperCase = c => c === c.toUpperCase() && c !== c.toLowerCase();
    const isSeparator = c => c === '-' || c === '_' || c === ' ';

    return map(str, (i, c) => {
        prevIsSeparator = isSeparator(prev);
        prevIsUpperCase = isUpperCase(prev);
        prev = c;

        if (isSeparator(c)) {
            return null;
        } else if (prevIsSeparator) {
            c = c.toUpperCase();
            prevReplaced = true;
        } else if (isUpperCase(c)) {
            if (i === 0) {
                c = c.toLowerCase();
            } else if (prevIsUpperCase && !prevReplaced) {
                c = c.toLowerCase();
            }

            prevReplaced = false;
        } else {
            prevReplaced = false;
        }

        return c;
    }).join('');
}

export const format = function(str, ...args) {
    if (args.length) {
        each(args, (i, arg) => {
            if (isString(arg)) {
                const o = {};
                o[i] = arg;
                arg = o;
            }

            each(arg, (placeholder, replacement) => {
                str = str.replace(new RegExp('\\{' + placeholder + '\\}', 'gm'), match =>
                    isUndefined(replacement) ? match : replacement)
            })
        })
    }

    return str;
}

export const f = format

/**
 * @see https://stackoverflow.com/questions/7627000/javascript-convert-string-to-safe-class-name-for-css
 */
export const toCssClassName = function(str) {
    return str.replace(/[^a-z0-9_-]/ig, s => {
        const c = s.charCodeAt(0);
        if (c === 32) return '-';
        return '__' + ('000' + c.toString(16)).slice(-4);
    })
}

export const hilite = function(str, req, tag = 'strong')
{
    str = decodeHtml(str);
    let str_folded = noAccent(str).toLowerCase().replace(/[\[\]]+/g, '');
    let q_folded, re, hilite_hints = '';

    if (!isArray(req)) {
        req = [req];
    }

    each(req, (i, q) => {
        if (q.length) {
            q = decodeHtml(q);
            q_folded = noAccent(q).toLowerCase().replace(/[\[\]]+/g, '');

            re = new RegExp(escapeRegex(q_folded), 'g');
            hilite_hints = str_folded.replace(re, `[${q_folded}]`);

            str_folded = hilite_hints;
        }
    })

    if (!hilite_hints.length) {
        return str;
    }

    let spos = 0;
    let highlighted = '';
    let dirHook = 'end';

    each(hilite_hints, (i, hint) => {
        const c = str.charAt(spos);

        if (hint === '[' && dirHook === 'end') {
            highlighted += `<${tag}>`;
            dirHook = 'start';
        } else if (hint === ']' && dirHook === 'start') {
            highlighted += `</${tag}>`;
            dirHook = 'end';
        } else {
            spos += 1;
            highlighted += c;
        }
    })

    return highlighted
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(new RegExp(`&lt;${tag}&gt;`, 'g'), `<${tag}>`)
        .replace(new RegExp(`&lt;/${tag}&gt;`, 'g'), `</${tag}>`)
        .replace(new RegExp('&lt;br&gt;', 'g'), '<br>');
}

export const formatSize = function(bytes, decimalPoint = ',')
{
    let i = -1, decimals = 0;

    do {
        bytes /= 1024;
        i++;
    } while (bytes > 999);

    if (!isInteger(bytes)) {
        decimals = 1;
    }

    const units = map(['k', 'M', 'G', 'T', 'P', 'E'], (i, prefix) => {
        return prefix + 'B';
    })

    return numberFormat(Math.max(bytes, 0), decimals, true, '', decimalPoint) + ' ' + units[i];
}

export const compareMixAlphaDigits = (a, b) => {
    if (a === b) return 0;

    if (isInteger(a) && isInteger(b)) {
        return Math.sign(a - b);
    }

    let startEq = '';

    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a.charAt(i) === b.charAt(i) && !isInteger(a)) {
            startEq += a.charAt(i);
        } else {
            break;
        }
    }

    a = a.slice(startEq.length);
    b = b.slice(startEq.length);

    let nbA = '';
    let idxDigitA = null;

    each(a, (i, c) => {
        if (!nbA) {
            idxDigitA = i;
            if (c >= '0' && c <= '9') {
                nbA += c;
            }
        } else {
            if (c >= '0' && c <= '9') {
                nbA += c;
                return true;
            }

            return false;
        }
    });

    let nbB = '';
    let idxDigitB = null;

    each(b, (i, c) => {
        if (!nbB) {
            idxDigitB = i;
            if (c >= '0' && c <= '9') {
                nbB += c;
            }
        } else {
            if (c >= '0' && c <= '9') {
                nbB += c;
                return true;
            }

            return false;
        }
    });

    if (nbA.length && nbB.length && idxDigitA === idxDigitB) {
        if (a.substring(0, idxDigitA) === b.substring(0, idxDigitB)) {
            return Math.sign(nbA - nbB);
        }
    }

    return a > b ? 1 : -1;
}
