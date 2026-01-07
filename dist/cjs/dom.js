function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import { isArray, isArrayLike, isObject, isString } from "./is.js";
import { camelCase } from "./string.js";
import { each, foreach, map } from "./traversal.js";
import { inArray } from "./array.js";
var cssNumber = ['animationIterationCount', 'aspectRatio', 'borderImageSlice', 'columnCount', 'flexGrow', 'flexShrink', 'fontWeight', 'gridArea', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity', 'stopOpacity', 'strokeMiterlimit', 'strokeOpacity'];
export var isWindow = function isWindow(o) {
  return !!o && o === o.window;
};
export var isDomElement = function isDomElement(o) {
  return isObject(o) && o instanceof HTMLElement;
};
export var getStyle = function getStyle(elem, cssRule) {
  if (!isDomElement(elem)) {
    return '';
  }
  if (window.getComputedStyle) {
    var computedStyle = window.getComputedStyle(elem, null);
    return computedStyle.getPropertyValue(cssRule) || computedStyle[camelCase(cssRule)] || '';
  }
  return elem.style[camelCase(cssRule)] || '';
};
export default {
  /**
   * @param {Element} el
   * @param {string} [selector]
   * @returns {NodeList}
   */
  children: function children(el, selector) {
    return selector ? this.find(el, ":scope > ".concat(selector)) : el.children;
  },
  /**
   * @param {Element} el
   * @param {string} [selector]
   * @returns {Element|null}
   */
  child: function child(el, selector) {
    return this.first(this.children(el, selector));
  },
  /**
   * @param {Element|Document} refEl
   * @param {string|Element|NodeList|Array<Element>} [selector]
   * @returns {Element|null}
   */
  findOne: function findOne(refEl, selector) {
    var _this$find$;
    return (_this$find$ = this.find(refEl, selector)[0]) !== null && _this$find$ !== void 0 ? _this$find$ : null;
  },
  /**
   * @param {Element|Document} refEl
   * @param {string|Element|NodeList|Array<Element>} selector
   * @returns {Array<Element>}
   */
  find: function find(refEl, selector) {
    if (undefined === selector) {
      selector = refEl;
      refEl = document;
    }
    if (selector instanceof Element) {
      selector = [selector];
    }
    if (isArrayLike(selector)) {
      return map(Array.from(selector), function (i, el) {
        if (el instanceof Element) {
          return refEl === el || refEl.contains(el) ? el : null;
        }
        return null;
      });
    }
    return Array.from(refEl.querySelectorAll(selector));
  },
  /**
   * @param {Element} el
   * @param {string} data
   * @param {string} value
   * @returns {Element|null}
   */
  findOneByData: function findOneByData(el, data, value) {
    var _this$findByData$;
    return (_this$findByData$ = this.findByData(el, data, value)[0]) !== null && _this$findByData$ !== void 0 ? _this$findByData$ : null;
  },
  /**
   * @param {Element} el
   * @param {string} data
   * @param {string} value
   * @returns {Element[]}
   */
  findByData: function findByData(el, data, value) {
    var escapeValue = CSS.escape(value);
    return this.find(el, "[data-".concat(data, "=\"").concat(escapeValue, "\"]"));
  },
  /**
   * @param {Element|NodeList|Array<Element>} el
   * @param {string} className
   * @returns {Element|NodeList|Array<Element>}
   */
  addClass: function addClass(el, className) {
    if (!className) return el;
    var classNames = className.split(' ').map(function (c) {
      return c.trim();
    }).filter(Boolean);
    var elements = el instanceof Element ? [el] : Array.from(el);
    elements.forEach(function (e) {
      if (e instanceof Element) {
        var _e$classList;
        (_e$classList = e.classList).add.apply(_e$classList, _toConsumableArray(classNames));
      }
    });
    return el;
  },
  /**
   * @param {Element|NodeList|Array<Element>} el
   * @param {string} className
   * @returns {Element|NodeList|Array<Element>}
   */
  removeClass: function removeClass(el, className) {
    if (!className) return;
    var classNames = className.split(' ').map(function (c) {
      return c.trim();
    }).filter(Boolean);
    var elements = el instanceof Element ? [el] : Array.from(el);
    elements.forEach(function (e) {
      if (e instanceof Element) {
        var _e$classList2;
        (_e$classList2 = e.classList).remove.apply(_e$classList2, _toConsumableArray(classNames));
      }
    });
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} classNames
   * @param {boolean} [force]
   * @returns {Element}
   */
  toggleClass: function toggleClass(el, classNames, force) {
    foreach(classNames.split(' ').map(function (c) {
      return c.trim();
    }).filter(Boolean), function (c) {
      return el.classList.toggle(c, force);
    });
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} classNames
   * @returns {boolean}
   */
  hasClass: function hasClass(el, classNames) {
    if (!classNames) return false;
    var foundClasses = true;
    foreach(classNames.split(' ').map(function (c) {
      return c.trim();
    }).filter(Boolean), function (c) {
      if (el.classList.contains(c)) {
        return true;
      }
      foundClasses = false;
      return false;
    });
    return foundClasses;
  },
  /**
   * @param {Node} node
   * @param {...Node} children
   * @returns {Node}
   */
  append: function append(node) {
    for (var _len = arguments.length, children = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      children[_key - 1] = arguments[_key];
    }
    node.append.apply(node, children);
    return node;
  },
  /**
   * @param {Node} node
   * @param {...Node} children
   * @returns {Node}
   */
  prepend: function prepend(node) {
    for (var _len2 = arguments.length, children = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      children[_key2 - 1] = arguments[_key2];
    }
    node.prepend.apply(node, children);
    return node;
  },
  /**
   * @param {Element|NodeList|Array<Element>|string} els
   * @returns {void}
   */
  remove: function remove() {
    var _this = this;
    for (var _len3 = arguments.length, els = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      els[_key3] = arguments[_key3];
    }
    els.forEach(function (el) {
      if (el instanceof Element) {
        el.remove();
      } else if (el instanceof NodeList || isArray(el)) {
        Array.from(el).forEach(function (e) {
          return e.remove();
        });
      } else {
        _this.remove(_this.find(el));
      }
    });
  },
  /**
   * @param {Element} el
   * @param {string|Element} selector
   * @returns {Element|null}
   */
  closest: function closest(el, selector) {
    if (selector instanceof Element) {
      if (el === selector) {
        return el;
      }
      var parentEl = el.parentElement;
      while (parentEl) {
        if (parentEl === selector) {
          return parentEl;
        }
        parentEl = parentEl.parentElement;
      }
      return null;
    }
    return el.closest(selector);
  },
  /**
   * @param {Element} el
   * @param {string} [selector]
   * @returns {Element|null}
   */
  next: function next(el) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var sibling = el.nextElementSibling;
    if (!selector) return sibling;
    if (sibling && sibling.matches(selector)) {
      return sibling;
    }
    return null;
  },
  /**
   * @param {Element} el
   * @param {string|null} [selector]
   * @returns {Element|null}
   */
  prev: function prev(el) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var sibling = el.previousElementSibling;
    if (!selector) return sibling;
    if (sibling && sibling.matches(selector)) {
      return sibling;
    }
    return null;
  },
  /**
   * @param {Element} el
   * @param {string} [selector]
   * @returns {Element[]}
   */
  nextAll: function nextAll(el, selector) {
    var siblings = [];
    var sibling = el.nextElementSibling;
    while (sibling) {
      if (undefined === selector || sibling.matches(selector)) {
        siblings.push(sibling);
      }
      sibling = sibling.nextElementSibling;
    }
    return siblings;
  },
  /**
   * @param {Element} el
   * @param {string} [selector]
   * @returns {Element[]}
   */
  prevAll: function prevAll(el, selector) {
    var siblings = [];
    var sibling = el.previousElementSibling;
    while (sibling) {
      if (undefined === selector || sibling.matches(selector)) {
        siblings.push(sibling);
      }
      sibling = sibling.previousElementSibling;
    }
    return siblings;
  },
  /**
   * @param {Element} el
   * @param {Element|string} selector
   * @returns {Element[]}
   */
  nextUntil: function nextUntil(el, selector) {
    var selectorIsElement = false;
    var list = [];
    if (selector instanceof Element) {
      selectorIsElement = true;
    }
    var nextSibling = el.nextElementSibling;
    while (nextSibling) {
      var found = selectorIsElement ? nextSibling === selector : nextSibling.matches(selector);
      if (found) break;
      list.push(nextSibling);
      nextSibling = nextSibling.nextElementSibling;
    }
    return list;
  },
  /**
   * @param {Element} el
   * @param {Element|string} selector
   * @returns {Element[]}
   */
  prevUntil: function prevUntil(el, selector) {
    var selectorIsElement = false;
    var list = [];
    if (selector instanceof Element) {
      selectorIsElement = true;
    }
    var prevSibling = el.previousElementSibling;
    while (prevSibling) {
      var found = selectorIsElement ? prevSibling === selector : prevSibling.matches(selector);
      if (found) break;
      list.push(prevSibling);
      prevSibling = prevSibling.previousElementSibling;
    }
    return list;
  },
  /**
   * @param {Element} el
   * @param {Element} wrappingElement
   * @returns {Element}
   */
  wrap: function wrap(el, wrappingElement) {
    if (!wrappingElement.isConnected) {
      el.parentNode.insertBefore(wrappingElement, el);
    }
    this.append(wrappingElement, el);
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} name
   * @param {*} [value]
   * @returns {Element|*}
   */
  attr: function attr(el, name, value) {
    if (undefined === value) return el.getAttribute(name);
    if (null === value) {
      el.removeAttribute(name);
    } else {
      el.setAttribute(name, value);
    }
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} name
   * @param {*} [value]
   * @returns {*|Element}
   */
  prop: function prop(el, name, value) {
    if (undefined === value) {
      return el[name];
    }
    el[name] = value;
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} [html]
   * @returns {Element|*}
   */
  html: function html(el, _html) {
    if (undefined === _html) return el.innerHTML;
    el.innerHTML = _html;
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} [text]
   * @returns {Element|*}
   */
  text: function text(el, _text) {
    if (undefined === _text) return el.innerText;
    el.innerText = _text;
    return el;
  },
  /**
   * @param {Element} el
   * @returns {Element}
   */
  hide: function hide(el) {
    if (undefined === this.data(el, '__display__')) {
      var display = getComputedStyle(el).display;
      this.data(el, '__display__', display);
    }
    el.style.display = 'none';
    return el;
  },
  /**
   * @param {Element} el
   * @returns {Element}
   */
  show: function show(el) {
    var dataDisplay = this.data(el, '__display__');
    if (undefined === dataDisplay) {
      el.style.removeProperty('display');
    } else {
      el.style.display = dataDisplay;
      this.removeData(el, '__display__');
    }
    return el;
  },
  /**
   * @param {Element} el
   * @returns {Element}
   */
  toggle: function toggle(el) {
    return 'none' === el.style.display ? this.show(el) : this.hide(el);
  },
  /**
   * @param {Element} el
   * @param {Object<string, string>|string} name
   * @param {string} [value]
   * @returns {Element|DOMStringMap}
   */
  data: function data(el, name, value) {
    var _this2 = this;
    if (undefined === name && undefined === value) {
      return el.dataset;
    }
    if (webf.isPlainObject(name)) {
      webf.each(name, function (k, v) {
        return _this2.data(el, k, v);
      });
      return el;
    }
    var isAttr = /^data-/.test(name + '');
    var key = camelCase(isAttr ? (name + '').replace(/^data-/, '') : name + '');
    if (undefined === value) return el.dataset[key];
    if (null === value) {
      this.removeData(el, key);
      return el;
    }
    el.dataset[key] = value;
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} name
   * @returns {Element|*}
   */
  removeData: function removeData(el, name) {
    var key = camelCase((name + '').replace(/^data-/, ''));
    delete el.dataset[key];
    return el;
  },
  /**
   * @param {Element|Document|Window} el
   * @param {string} event
   * @param {function} handler
   * @param {AddEventListenerOptions|false} options
   * @returns {Element}
   */
  on: function on(el, event, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    el.addEventListener(event, handler, options);
    return el;
  },
  /**
   * @param {Element|Document|Window} el
   * @param {string} event
   * @param {function} handler
   * @param {Object} options
   * @returns {Element}
   */
  off: function off(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
    return el;
  },
  /**
   * @param {HTMLElement} el
   * @param {Object<string, string>|string} style
   * @param {string} [value]
   * @returns {Element}
   */
  css: function css(el, style, value) {
    var _this3 = this;
    if (isString(style)) {
      var prop = style.startsWith('--') ? style : camelCase(style);
      if (undefined === value) {
        return getStyle(el, prop);
      }
      if (prop.startsWith('--')) {
        el.style.setProperty(prop, String(value));
      } else {
        if (typeof value === "number" && !inArray(prop, cssNumber)) value += 'px';
        el.style[prop] = value;
      }
    } else {
      each(style, function (name, v) {
        _this3.css(el, name, v);
      });
    }
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} selectorClosest
   * @param {string} selectorFind
   * @returns {NodeList|null}
   */
  closestFind: function closestFind(el, selectorClosest, selectorFind) {
    var closest = this.closest(el, selectorClosest);
    if (closest) {
      return this.find(closest, selectorFind);
    }
    return null;
  },
  /**
   * @param {Element} el
   * @param {string} selectorClosest
   * @param {string} selectorFindOne
   * @returns {Element|null}
   */
  closestFindOne: function closestFindOne(el, selectorClosest, selectorFindOne) {
    var closest = this.closest(el, selectorClosest);
    if (closest) {
      return this.findOne(closest, selectorFindOne);
    }
    return null;
  },
  /**
   * @param {NodeList|Element|Array<Element>} nodeList
   * @returns {Element|null}
   */
  first: function first(nodeList) {
    if (nodeList instanceof Element) return nodeList;
    return nodeList.length ? Array.from(nodeList)[0] : null;
  },
  /**
   * @param {NodeList|Array<Element>} nodeList
   * @returns {Element|null}
   */
  last: function last(nodeList) {
    var arr = Array.from(nodeList)[0];
    return arr[arr.length - 1];
  },
  /**
   * @param {string} html
   * @returns {Element|null}
   */
  create: function create(html) {
    var _tpl$content$firstEle;
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return (_tpl$content$firstEle = tpl.content.firstElementChild) !== null && _tpl$content$firstEle !== void 0 ? _tpl$content$firstEle : null;
  },
  /**
   * @param {NodeList} nodeList
   * @param {number} [index=0]
   * @returns {Element|null}
   */
  eq: function eq(nodeList) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (Math.abs(index) >= nodeList.length) return null;
    if (index < 0) {
      index = nodeList.length + index;
    }
    return nodeList.item(index);
  },
  /**
   * @param {Element} el
   * @param {Element} newEl
   * @returns {Element}
   */
  after: function after(el, newEl) {
    return el.parentElement.insertBefore(newEl, el.nextElementSibling);
  },
  /**
   * @param {Element} el
   * @param {Element} newEl
   * @returns {Element}
   */
  before: function before(el, newEl) {
    return el.parentElement.insertBefore(newEl, el);
  },
  /**
   * @param {Element} el
   * @returns {Element}
   */
  empty: function empty(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    return el;
  },
  /**
   * @param {Element|NodeList} el
   * @param {string|Element} selector
   * @return {Element[]}
   */
  not: function not(el, selector) {
    var elements = el instanceof Element ? [el] : Array.from(el);
    var selectorIsString = webf.isString(selector);
    return elements.filter(function (e) {
      if (!(e instanceof Element)) return false;
      return selectorIsString ? !e.matches(selector) : e !== selector;
    });
  },
  /**
   * @param {Element} el
   * @param {Element} child
   * @param {Element} oldChild
   */
  replaceChild: function replaceChild(el, child, oldChild) {
    return el.replaceChild(child, oldChild);
  },
  /**
   * @param {Element} el
   * @param {Element[]} children
   * @returns {Element}
   */
  replaceChildren: function replaceChildren(el) {
    for (var _len4 = arguments.length, children = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      children[_key4 - 1] = arguments[_key4];
    }
    el.replaceChildren.apply(el, children);
    return el;
  }
};