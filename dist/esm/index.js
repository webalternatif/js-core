function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as stringFunctions from './string.js';
import './stringPrototype.js';
import * as arrayFunctions from './array.js';
import * as is from './is.js';
import * as random from './random.js';
import * as traversal from './traversal.js';
import dom, { getStyle, isDomElement, isWindow, isDocument } from './dom.js';
import * as math from './math.js';
import * as utils from './utils.js';
import eventDispatcher from './eventDispatcher.js';
import Mouse from './Mouse.js';
import Translator from './Translator.js';

/**
 * Main entry point of js-core.
 *
 * Provides pure JavaScript utility functions such as string, array,
 * type checking, traversal, math and other helpers.
 *
 * @module webf
 */
var webf = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, stringFunctions), arrayFunctions), traversal), is), random), {}, {
  isWindow: isWindow,
  isDocument: isDocument,
  isDomElement: isDomElement,
  getStyle: getStyle
}, math), utils);

/**
 * Default export containing pure utility functions.
 *
 * @example
 * import webf from '@webalternatif/js-core'
 * webf.unique([1,2,2])
 */
export default webf;

/**
 * String utility functions.
 * @module stringFunctions
 */

/**
 * Array utility functions.
 * @module arrayFunctions
 */

/**
 * DOM manipulation and event helpers.
 * Must be imported explicitly.
 *
 * @example
 * import { dom } from '@webalternatif/js-core'
 * dom.on(el, 'click', (ev) => {
 *     doSomething(ev.currentTarget)
 * })
 *
 * @module dom
 */

/**
 * Lightweight custom event dispatcher (pub/sub).
 *
 * @example
 * import { eventDispatcher } from '@webalternatif/js-core'
 * const dispatcher = eventDispatcher()
 * dispatcher.addListener('save', (eventName, arg1, arg2) => {})
 * dispatcher.dispatch('save', arg1, arg2)
 *
 * @module eventDispatcher
 */

/**
 * Mouse utilities.
 * @module Mouse
 */

/**
 * Simple translation utility.
 *
 * @example
 * import { Translator } from '@webalternatif/js-core'
 * const t = new Translator({ en: { hi: 'Hello' } })
 *
 * @module Translator
 */
export { stringFunctions, arrayFunctions, traversal, is, random, getStyle, dom, math, utils, eventDispatcher, Mouse, Translator };