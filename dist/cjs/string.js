"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ucfirst = exports.trim = exports.toUrl = exports.toPrice = exports.toCssClassName = exports.thousandSeparator = exports.substringIndex = exports.stripTags = exports.stripMultipleSpaces = exports.rtrim = exports.rgbtohex = exports.rgb2hex = exports.reverse = exports.repeat = exports.parse_url = exports.pad = exports.numberFormat = exports.noAccent = exports.nl2br = exports.ltrim = exports.lcfirst = exports.insertTag = exports.insert = exports.htmlsimplequotes = exports.htmlquotes = exports.hilite = exports.hextorgb = exports.hex2rgb = exports.formatSize = exports.format = exports.f = exports.escapeRegex = exports.decodeHtml = exports.compareMixAlphaDigits = exports.camelCase = exports.br2nl = exports.addUrlParam = void 0;
var _is = require("./is.js");
var _math = require("./math.js");
var _array = require("./array.js");
var _traversal = require("./traversal.js");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// import {translate} from "./Translator.js";

var trim = exports.trim = function trim(str) {
  var _char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\\s';
  return ltrim(rtrim(str, _char), _char);
};
var ltrim = exports.ltrim = function ltrim(str) {
  var _char2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\\s';
  return str.replace(new RegExp("^".concat(_char2, "+"), 'g'), '');
};
var rtrim = exports.rtrim = function rtrim(str) {
  var _char3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\\s';
  return str.replace(new RegExp("".concat(_char3, "+$"), 'g'), '');
};
var stripMultipleSpaces = exports.stripMultipleSpaces = function stripMultipleSpaces(str) {
  return str.trim().replace(/ +/g, ' ');
};
var noAccent = exports.noAccent = function noAccent(str) {
  return str.replace(/[àäâ]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[îïí]/g, 'i').replace(/[öô]/g, 'o').replace(/[üù]/g, 'u').replace(/ç/g, 'c').replace(/ÿ/g, 'y').replace(/[ÀÄÂ]/g, 'A').replace(/[ÈÉÊË]/g, 'E').replace(/[ÎÏÍ]/g, 'I').replace(/[ÖÔ]/g, 'O').replace(/[ÜÙ]/g, 'U').replace(/Ç/g, 'C').replace(/Ÿ/g, 'Y');
};
var br2nl = exports.br2nl = function br2nl(str) {
  return str.split(/<br\s*\/*>/).join('\n');
};
var nl2br = exports.nl2br = function nl2br(str) {
  return str.split('\n').join('<br>');
};
var ucfirst = exports.ucfirst = function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
var lcfirst = exports.lcfirst = function lcfirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
};
var insertTag = exports.insertTag = function insertTag(str, tag) {
  var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var startTag = "<".concat(tag, ">");
  var endTag = "</".concat(tag, ">");
  if (['br', 'hr', 'img', 'link', 'input'].includes(tag)) {
    startTag = "<".concat(tag, "/>");
    endTag = '';
  }
  return str.slice(0, position) + startTag + str.slice(position, position + length) + endTag + str.slice(position + length);
};
var substringIndex = exports.substringIndex = function substringIndex(str, delimiter, index) {
  var input = str + '',
    arr = input.split(delimiter);
  if (index > 0) {
    arr.splice(index, arr.length - index);
  } else if (index < 0) {
    arr.splice(0, arr.length + index);
  }
  return arr.join(delimiter);
};
var insert = exports.insert = function insert(str, ins, n) {
  if (n >= str.length) {
    return str;
  }
  return _toConsumableArray(str).reduce(function (newStr, _char4, index) {
    if (index > 0 && index % n === 0) {
      return newStr + ins + _char4;
    }
    return newStr + _char4;
  }, '');
};
var reverse = exports.reverse = function reverse(str) {
  var res = [];
  for (var i = 0; i < str.length; i++) {
    res.unshift(str[i]);
  }
  return res.join('');
};
var thousandSeparator = exports.thousandSeparator = function thousandSeparator(value) {
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
  var pointDecimal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  if ((0, _is.isUndefined)(value) || null === value) {
    return value;
  }
  value = (value + '').replace(',', '.');
  if (Math.abs(value) >= 1000) {
    var intval = Math[value >= 1000 ? 'floor' : 'ceil'](value) + '';
    var newval = reverse(insert(reverse(intval), reverse(separator), 3));
    return value.indexOf('.') > 0 ? newval + pointDecimal + substringIndex(value, '.', -1) : newval;
  }
  return (value + '').replace('.', pointDecimal);
};
var numberFormat = exports.numberFormat = function numberFormat(number) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var forceCentimes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var thousandSep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var pointDecimal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '.';
  number = number ? number + '' : '0';
  number = (0, _math.round)(parseFloat(number.replace(',', '.')), decimals) + '';
  if (decimals === 0) {
    return thousandSeparator(number, thousandSep, pointDecimal);
  }
  var pos = number.lastIndexOf('.');
  if (-1 === pos) {
    if (true === forceCentimes) {
      number += pointDecimal + repeat('0', decimals);
    }
    return thousandSeparator(number, thousandSep, pointDecimal);
  }
  var digits = number.slice(pos + 1);
  var nbDigits = digits.length;
  if (decimals > nbDigits) {
    return thousandSeparator(number + '0'.repeat(decimals - nbDigits), thousandSep, pointDecimal);
  }
  return thousandSeparator(number.slice(0, pos + 1 + decimals), thousandSep, pointDecimal);
};
var toPrice = exports.toPrice = numberFormat;

/**
 * Pads a string to a specified length with a specified string and padding type
 *
 * @param {string} str
 * @param {number} pad_length
 * @param {string} [pad_str]
 * @param {string} [pad_type]
 * @returns {string}
 */
var pad = exports.pad = function pad(str, pad_length) {
  var pad_str = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
  var pad_type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'left';
  if ((0, _is.isUndefined)(pad_length) || str.length >= pad_length || !(0, _array.inArray)(pad_type, ['left', 'right'])) {
    return str;
  }
  if (pad_type === 'left') {
    return pad_str.repeat(Math.ceil(pad_length / pad_str.length)).slice(0, pad_length - str.length) + str;
  }
  return str + pad_str.repeat(Math.ceil(pad_length / pad_str.length)).slice(0, pad_length - str.length);
};

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
var _rgb2hex = exports.rgb2hex = function rgb2hex(r, g, b) {
  if ((0, _is.isArray)(r)) {
    return _rgb2hex.apply(void 0, _toConsumableArray(r));
  }
  if (!(0, _is.isInteger)(r) || !(0, _is.isInteger)(g) || !(0, _is.isInteger)(b)) return '';
  return [pad((0, _math.dec2hex)(parseInt(r)), 2, '0').toUpperCase(), pad((0, _math.dec2hex)(parseInt(g)), 2, '0').toUpperCase(), pad((0, _math.dec2hex)(parseInt(b)), 2, '0').toUpperCase()].join('');
};
var rgbtohex = exports.rgbtohex = _rgb2hex;

/**
 * Converts a hexadecimal color to RGB values.
 *
 * @param {string} hex - The hexadecimal value (e.g #FF0000)
 * @returns {number[]} The RGB color array (e.g [255, 0, 0]).
 */
var hex2rgb = exports.hex2rgb = function hex2rgb(hex) {
  if (!(0, _is.isString)(hex) || !hex.length) return [];
  hex = hex.slice(-6).toUpperCase();
  if (hex.length < 6) {
    hex = (0, _traversal.map)(hex.slice(-3), function (i, h) {
      return h + '' + h;
    }).join('');
  }
  for (var i = 0; i < hex.length; i++) {
    if (-1 === '0123456789ABCDEF'.indexOf(hex[i])) {
      return [];
    }
  }
  return (0, _traversal.map)(insert(hex, ',', 2).split(','), function (i, h) {
    return (0, _math.hex2dec)(h);
  });
};
var hextorgb = exports.hextorgb = hex2rgb;

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
var parse_url = exports.parse_url = function parse_url(str) {
  var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'],
    parser = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
  var m = parser.exec(str);
  var uri = {},
    i = 14;
  while (i--) {
    if (m[i]) {
      uri[key[i]] = m[i];
    }
  }
  delete uri.source;
  return uri;
};

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
var _addUrlParam = exports.addUrlParam = function addUrlParam(url, param) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if ((0, _is.isPlainObject)(param)) {
    (0, _traversal.each)(param, function (key, val) {
      url = _addUrlParam(url, key, val);
    });
    return url;
  }
  var parseUrl = parse_url(url),
    pos,
    hash = "";
  if ((pos = url.indexOf("#")) > -1) {
    hash = url.slice(pos);
    url = url.slice(0, pos);
  }
  var key = encodeURIComponent(param);
  var val = value === null ? '' : encodeURIComponent(value);
  if (!parseUrl.query) {
    return url + "?" + key + "=" + val + hash;
  }
  var params = parseUrl.query.split('&');
  var param_exists = false;
  for (var i = 0; i < params.length; i++) {
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
};
var decodeHtml = exports.decodeHtml = function decodeHtml(str) {
  if (!(0, _is.isString)(str)) return '';
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'");
};
var htmlquotes = exports.htmlquotes = function htmlquotes(str) {
  if (!(0, _is.isString)(str)) return '';
  return str.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
var htmlsimplequotes = exports.htmlsimplequotes = function htmlsimplequotes(str) {
  if (!(0, _is.isString)(str)) return '';
  return str.replace(/'/g, "&#039;");
};
var repeat = exports.repeat = function repeat(str, n) {
  if (!(0, _is.isString)(str) || !(0, _is.isFloat)(n)) return '';
  return new Array(Math.floor(n) + 1).join(str);
};
var stripTags = exports.stripTags = function stripTags(str, tag) {
  if ((0, _is.isString)(tag)) {
    var rStripTags = new RegExp("<".concat(tag, "[^>]*>(.*?)</").concat(tag, ">|<").concat(tag, "[^>]*/>"), 'ig');
    while (rStripTags.test(str)) str = str.replace(rStripTags, '$1');
    return str;
  }
  return str.replace(/(<([^>]+)>)/ig, "");
};
var toUrl = exports.toUrl = function toUrl(str) {
  return trim(noAccent(str).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-'), '-');
};

/**
 * @see http://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
 */
var escapeRegex = exports.escapeRegex = function escapeRegex(str) {
  return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&").replace(/[\n\t]/g, " ");
};
var camelCase = exports.camelCase = function camelCase(str) {
  if (!str) return '';
  var prev = '';
  var prevReplaced = false;
  var prevIsSeparator = false;
  var prevIsUpperCase = false;
  str = trim(str);
  str = trim(str, '_');
  str = trim(str, '-');
  var isUpperCase = function isUpperCase(c) {
    return c === c.toUpperCase() && c !== c.toLowerCase();
  };
  var isSeparator = function isSeparator(c) {
    return c === '-' || c === '_' || c === ' ';
  };
  return (0, _traversal.map)(str, function (i, c) {
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
};
var format = exports.format = function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  if (args.length) {
    (0, _traversal.each)(args, function (i, arg) {
      if ((0, _is.isString)(arg)) {
        var o = {};
        o[i] = arg;
        arg = o;
      }
      (0, _traversal.each)(arg, function (placeholder, replacement) {
        str = str.replace(new RegExp('\\{' + placeholder + '\\}', 'gm'), function (match) {
          return (0, _is.isUndefined)(replacement) ? match : replacement;
        });
      });
    });
  }
  return str;
};
var f = exports.f = format;

/**
 * @see https://stackoverflow.com/questions/7627000/javascript-convert-string-to-safe-class-name-for-css
 */
var toCssClassName = exports.toCssClassName = function toCssClassName(str) {
  return str.replace(/[^a-z0-9_-]/ig, function (s) {
    var c = s.charCodeAt(0);
    if (c === 32) return '-';
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
};
var hilite = exports.hilite = function hilite(str, req) {
  var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'strong';
  str = decodeHtml(str);
  var str_folded = noAccent(str).toLowerCase().replace(/[\[\]]+/g, '');
  var q_folded,
    re,
    hilite_hints = '';
  if (!(0, _is.isArray)(req)) {
    req = [req];
  }
  (0, _traversal.each)(req, function (i, q) {
    if (q.length) {
      q = decodeHtml(q);
      q_folded = noAccent(q).toLowerCase().replace(/[\[\]]+/g, '');
      re = new RegExp(escapeRegex(q_folded), 'g');
      hilite_hints = str_folded.replace(re, "[".concat(q_folded, "]"));
      str_folded = hilite_hints;
    }
  });
  if (!hilite_hints.length) {
    return str;
  }
  var spos = 0;
  var highlighted = '';
  var dirHook = 'end';
  (0, _traversal.each)(hilite_hints, function (i, hint) {
    var c = str.charAt(spos);
    if (hint === '[' && dirHook === 'end') {
      highlighted += "<".concat(tag, ">");
      dirHook = 'start';
    } else if (hint === ']' && dirHook === 'start') {
      highlighted += "</".concat(tag, ">");
      dirHook = 'end';
    } else {
      spos += 1;
      highlighted += c;
    }
  });
  return highlighted.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(new RegExp("&lt;".concat(tag, "&gt;"), 'g'), "<".concat(tag, ">")).replace(new RegExp("&lt;/".concat(tag, "&gt;"), 'g'), "</".concat(tag, ">")).replace(new RegExp('&lt;br&gt;', 'g'), '<br>');
};
var formatSize = exports.formatSize = function formatSize(bytes) {
  var decimalPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
  var i = -1,
    decimals = 0;
  do {
    bytes /= 1024;
    i++;
  } while (bytes > 999);
  if (!(0, _is.isInteger)(bytes)) {
    decimals = 1;
  }
  var units = (0, _traversal.map)(['k', 'M', 'G', 'T', 'P', 'E'], function (i, prefix) {
    return prefix + 'B';
  });
  return numberFormat(Math.max(bytes, 0), decimals, true, '', decimalPoint) + ' ' + units[i];
};
var compareMixAlphaDigits = exports.compareMixAlphaDigits = function compareMixAlphaDigits(a, b) {
  if (a === b) return 0;
  if ((0, _is.isInteger)(a) && (0, _is.isInteger)(b)) {
    return Math.sign(a - b);
  }
  var startEq = '';
  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    if (a.charAt(i) === b.charAt(i) && !(0, _is.isInteger)(a)) {
      startEq += a.charAt(i);
    } else {
      break;
    }
  }
  a = a.slice(startEq.length);
  b = b.slice(startEq.length);
  var nbA = '';
  var idxDigitA = null;
  (0, _traversal.each)(a, function (i, c) {
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
  var nbB = '';
  var idxDigitB = null;
  (0, _traversal.each)(b, function (i, c) {
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
};