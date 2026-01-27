import * as stringFunctions from './string.js'
import './stringPrototype.js'
import * as arrayFunctions from './array.js'
import * as is from './is.js'
import * as random from './random.js'
import * as traversal from './traversal.js'
import dom, { getStyle, isDomElement, isWindow, isDocument } from './dom.js'
import * as math from './math.js'
import * as utils from './utils.js'
import eventDispatcher from './eventDispatcher.js'
import Mouse from './Mouse.js'
import Translator from './Translator.js'

/**
 * Main entry point of js-core.
 *
 * Provides pure JavaScript utility functions such as string, array,
 * type checking, traversal, math and other helpers.
 *
 * @module webf
 */
const webf = {
    ...stringFunctions,
    ...arrayFunctions,
    ...traversal,
    ...is,
    ...random,
    isWindow,
    isDocument,
    isDomElement,
    getStyle,
    ...math,
    ...utils,
}

/**
 * Default export containing pure utility functions.
 *
 * @example
 * import webf from '@webalternatif/js-core'
 * webf.unique([1,2,2])
 */
export default webf

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
export {
    stringFunctions,
    arrayFunctions,
    traversal,
    is,
    random,
    getStyle,
    dom,
    math,
    utils,
    eventDispatcher,
    Mouse,
    Translator,
}
