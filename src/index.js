import * as stringFunctions from './string.js';
import './stringPrototype.js';
import * as arrayFunctions from './array.js';
import * as is from './is.js';
import * as traversal from './traversal.js';
import dom, {getStyle, isDomElement, isWindow, isDocument} from './dom.js';
import * as math from './math.js';
import * as utils from './utils.js';
import * as i18n from './i18n.js';
import eventDispatcher from './eventDispatcher.js'

const webf = {
    ...stringFunctions,
    ...arrayFunctions,
    ...traversal,
    ...is,
    dom, isWindow, isDocument, isDomElement, getStyle,
    ...math,
    ...utils,
    ...i18n,
    eventDispatcher
}

export default webf

export {
    stringFunctions,
    arrayFunctions,
    traversal,
    getStyle,
    dom,
    math,
    utils,
    eventDispatcher,
};
