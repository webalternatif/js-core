function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import { isArray, isArrayLike, isFunction, isObject, isPlainObject, isString, isTouchDevice } from "./is.js";
import { camelCase } from "./string.js";
import { each, foreach, map } from "./traversal.js";
import { inArray } from "./array.js";
import Mouse from "./Mouse.js";
var cssNumber = ['animationIterationCount', 'aspectRatio', 'borderImageSlice', 'columnCount', 'flexGrow', 'flexShrink', 'fontWeight', 'gridArea', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity', 'stopOpacity', 'strokeMiterlimit', 'strokeOpacity'];
var LISTENERS = new Map();
var CUSTOM_EVENTS = ['longtap', 'dbltap'];
var ENABLED_EVENTS = new Set();
var _teardownLongTap = null;
var _teardownDblTap = null;
var supplyEvent = function supplyEvent(event) {
  if (ENABLED_EVENTS !== null && ENABLED_EVENTS !== void 0 && ENABLED_EVENTS.has(event)) return;
  if (event === 'longtap') enableLongTap();
  if (event === 'dbltap') enableDblTap();
  ENABLED_EVENTS.add(event);
};
var enableLongTap = function enableLongTap() {
  var LONGPRESS_DELAY = 800;
  var MOVE_TOLERANCE = 8;
  var timer = null;
  var startX = 0;
  var startY = 0;
  var target = null;
  var start = function start(ev) {
    target = ev.target;
    var pos = Mouse.getViewportPosition(ev);
    startX = pos.x;
    startY = pos.y;
    timer = setTimeout(function () {
      target.dispatchEvent(new CustomEvent('longtap', {
        bubbles: true,
        cancelable: true,
        detail: {
          originalEvent: ev
        }
      }));
      timer = null;
    }, LONGPRESS_DELAY);
  };
  var move = function move(ev) {
    if (!timer) return;
    var pos = Mouse.getViewportPosition(ev);
    if (Math.hypot(pos.x - startX, pos.y - startY) > MOVE_TOLERANCE) {
      clearTimeout(timer);
      timer = null;
    }
  };
  var end = function end() {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  document.addEventListener('touchstart', start, {
    passive: true
  });
  document.addEventListener('touchmove', move, {
    passive: true
  });
  document.addEventListener('touchend', end);
  document.addEventListener('touchcancel', end);
  _teardownLongTap = function teardownLongTap() {
    document.removeEventListener('touchstart', start, {
      passive: true
    });
    document.removeEventListener('touchmove', move, {
      passive: true
    });
    document.removeEventListener('touchend', end);
    document.removeEventListener('touchcancel', end);
    _teardownLongTap = null;
  };
};
var enableDblTap = function enableDblTap() {
  var DBLTAP_DELAY = 300;
  var MOVE_TOLERANCE = 40;
  var lastTapTime = 0;
  var lastPos = null;
  if (isTouchDevice()) {
    document.addEventListener('dblclick', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
    }, {
      capture: true
    });
  }
  var start = function start(ev) {
    var target = ev.target;
    if (Date.now() - lastTapTime > DBLTAP_DELAY) {
      lastTapTime = Date.now();
      lastPos = Mouse.getViewportPosition(ev);
    } else {
      var pos = Mouse.getViewportPosition(ev);
      if (Math.hypot(pos.x - lastPos.x, pos.y - lastPos.y) <= MOVE_TOLERANCE) {
        target.dispatchEvent(new CustomEvent('dbltap', {
          bubbles: true,
          cancelable: true,
          detail: {
            originalEvent: ev
          }
        }));
      }
      lastTapTime = Date.now();
      lastPos = pos;
    }
  };
  document.addEventListener('touchstart', start, {
    passive: true
  });
  _teardownDblTap = function teardownDblTap() {
    document.removeEventListener('touchstart', start, {
      passive: true
    });
    _teardownDblTap = null;
  };
};

/**
 * @param {any} o
 * @returns {boolean}
 */
export var isWindow = function isWindow(o) {
  return !!o && o === o.window;
};

/**
 * @param {any} o
 * @returns {boolean}
 */
export var isDocument = function isDocument(o) {
  return !!o && o.nodeType === 9;
};

/**
 * @param {any} o
 * @returns {boolean}
 */
export var isDomElement = function isDomElement(o) {
  return isObject(o) && o instanceof HTMLElement;
};

/**
 * @param {Element} el
 * @param {string} cssRule
 * @returns {string}
 */
export var getStyle = function getStyle(el, cssRule) {
  if (!isDomElement(el)) {
    return '';
  }
  if (window.getComputedStyle) {
    var computedStyle = window.getComputedStyle(el, null);
    return computedStyle.getPropertyValue(cssRule) || computedStyle[camelCase(cssRule)] || '';
  }
  return el.style[camelCase(cssRule)] || '';
};
var dom = {
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
   * @param {Element|Document|string} refEl
   * @param {string|Element|NodeList|Array<Element>} selector
   * @returns {Element}
   */
  findOne: function findOne(refEl, selector) {
    var _this$find$;
    return (_this$find$ = this.find(refEl, selector)[0]) !== null && _this$find$ !== void 0 ? _this$find$ : null;
  },
  /**
   * @param {Element|Document|string} refEl
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
    try {
      return Array.from(refEl.querySelectorAll(selector));
    } catch (e) {
      return [];
    }
  },
  /**
   * @param {Element|string} el
   * @param {string} data
   * @param {string} [value]
   * @returns {Element|null}
   */
  findOneByData: function findOneByData(el, data, value) {
    var _this$findByData$;
    return (_this$findByData$ = this.findByData(el, data, value)[0]) !== null && _this$findByData$ !== void 0 ? _this$findByData$ : null;
  },
  /**
   * @param {Element|string} el
   * @param {string} data
   * @param {string} [value]
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
   * @param {...(Node|string)} children
   * @returns {Node}
   */
  append: function append(node) {
    var _this = this;
    for (var _len = arguments.length, children = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      children[_key - 1] = arguments[_key];
    }
    foreach(children, function (child) {
      if (isString(child)) {
        child = _this.create(child);
      }
      child && node.append(child);
    });
    return node;
  },
  /**
   * @param {Node} node
   * @param {...(Node|string)} children
   * @returns {Node}
   */
  prepend: function prepend(node) {
    var _this2 = this;
    for (var _len2 = arguments.length, children = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      children[_key2 - 1] = arguments[_key2];
    }
    foreach([].concat(children).reverse(), function (child) {
      if (isString(child)) {
        child = _this2.create(child);
      }
      child && node.prepend(child);
    });
    return node;
  },
  /**
   * @param {Element|NodeList|Array<Element>|string} els
   * @returns {void}
   */
  remove: function remove() {
    var _this3 = this;
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
        _this3.remove(_this3.find(el));
      }
    });
  },
  /**
   * @param {Element} el
   * @param {string|Element} [selector]
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
    if (undefined === selector) {
      return el;
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
    var _this4 = this;
    if (undefined === name && undefined === value) {
      return el.dataset;
    }
    if (isPlainObject(name)) {
      each(name, function (k, v) {
        return _this4.data(el, k, v);
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
   * @param {string} events
   * @param {string|Element|function} selector
   * @param {function|AddEventListenerOptions|boolean} [handler]
   * @param {AddEventListenerOptions|boolean} [options]
   * @returns {Element}
   */
  on: function on(el, events, selector, handler, options) {
    var _this5 = this;
    if (isFunction(selector)) {
      options = handler;
      handler = selector;
      selector = null;
    }
    foreach(events.split(' '), function (rawEvent) {
      var _rawEvent$split = rawEvent.split('.'),
        _rawEvent$split2 = _slicedToArray(_rawEvent$split, 2),
        event = _rawEvent$split2[0],
        namespace = _rawEvent$split2[1];
      var listener = function listener(ev) {
        if (!selector) {
          handler.call(el, ev);
          return;
        }
        var currentTarget = ev.target;
        while (currentTarget && currentTarget !== el) {
          if (_this5.matches(currentTarget, selector)) {
            var wrappedEv = {
              originalEvent: ev,
              type: ev.type,
              target: ev.target,
              currentTarget: currentTarget,
              relatedTarget: ev.relatedTarget,
              button: ev.button,
              pageX: ev.pageX,
              pageY: ev.pageY,
              preventDefault: function preventDefault() {
                return ev.preventDefault.apply(ev, arguments);
              },
              stopPropagation: function stopPropagation() {
                return ev.stopPropagation.apply(ev, arguments);
              },
              stopImmediatePropagation: function stopImmediatePropagation() {
                return ev.stopImmediatePropagation.apply(ev, arguments);
              }
            };
            handler.call(currentTarget, wrappedEv);
            break;
          }
          currentTarget = currentTarget.parentElement;
        }
      };
      var store = LISTENERS.get(el);
      if (!store) {
        store = [];
        LISTENERS.set(el, store);
      }
      store.push({
        event: event,
        handler: handler,
        selector: selector,
        listener: listener,
        namespace: namespace,
        options: options
      });
      if (inArray(event, CUSTOM_EVENTS)) {
        supplyEvent(event);
      }
      el.addEventListener(event, listener, options);
    });
    return el;
  },
  /**
   * @param {Element|Document|Window} el
   * @param {string} [events]
   * @param {string|Element|function} [selector]
   * @param {function|AddEventListenerOptions|boolean} [handler]
   * @param {AddEventListenerOptions|boolean} [options]
   * @returns {Element}
   */
  off: function off(el, events, selector, handler, options) {
    if (isFunction(selector)) {
      options = handler;
      handler = selector;
      selector = null;
    }
    var store = LISTENERS.get(el);
    if (!store) return el;
    var evts = events ? events.split(' ') : [undefined];
    foreach(evts, function (rawEvent) {
      var _ref = undefined === rawEvent ? [undefined, undefined] : rawEvent.split('.'),
        _ref2 = _slicedToArray(_ref, 2),
        event = _ref2[0],
        namespace = _ref2[1];
      event = !event ? undefined : event;
      var hasEvent = undefined !== event;
      var hasNs = undefined !== namespace;
      foreach(_toConsumableArray(store).reverse(), function (l) {
        var match = !hasEvent && !hasNs || hasEvent && !hasNs && l.event === event || !hasEvent && hasNs && l.namespace === namespace || hasEvent && hasNs && l.event === event && l.namespace === namespace;
        if (match && (undefined === event || l.event === event) && (undefined === handler || l.handler === handler) && (undefined === selector || l.selector === selector) && (undefined === namespace || l.namespace === namespace) && (undefined === options || l.options === options)) {
          el.removeEventListener(l.event, l.listener, l.options);
          var index = store.indexOf(l);
          index !== -1 && store.splice(index, 1);
        }
      });
    });
    return el;
  },
  /**
   * @param {HTMLElement} el
   * @param {Object<string, string>|string} style
   * @param {string} [value]
   * @returns {Element}
   */
  css: function css(el, style, value) {
    var _this6 = this;
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
        _this6.css(el, name, v);
      });
    }
    return el;
  },
  /**
   * @param {Element} el
   * @param {string} selectorClosest
   * @param {string} selectorFind
   * @returns {Array<Element>}
   */
  closestFind: function closestFind(el, selectorClosest, selectorFind) {
    var closest = this.closest(el, selectorClosest);
    if (closest) {
      return this.find(closest, selectorFind);
    }
    return [];
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
    var _Array$from$;
    if (nodeList instanceof Element) return nodeList;
    return (_Array$from$ = Array.from(nodeList)[0]) !== null && _Array$from$ !== void 0 ? _Array$from$ : null;
  },
  /**
   * @param {NodeList|Array<Element>} nodeList
   * @returns {Element|null}
   */
  last: function last(nodeList) {
    var _arr;
    if (nodeList instanceof Element) return nodeList;
    var arr = Array.from(nodeList);
    return (_arr = arr[arr.length - 1]) !== null && _arr !== void 0 ? _arr : null;
  },
  /**
   * @param {string} html
   * @returns {Element|DocumentFragment|null}
   */
  create: function create(html) {
    html += '';
    var isTagName = function isTagName(s) {
      return /^[A-Za-z][A-Za-z0-9-]*$/.test(s);
    };
    if (isTagName(html)) {
      return document.createElement(html);
    }
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    var frag = tpl.content;
    if (frag.childElementCount === 1 && frag.children.length === 1) {
      return frag.firstElementChild;
    }
    if (!frag.firstChild) return null;
    return frag.cloneNode(true);
  },
  /**
   * @param {NodeList|Array<Element>} nodeList
   * @param {number} [index=0]
   * @returns {Element|null}
   */
  eq: function eq(nodeList) {
    var _nodeList$index;
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    nodeList = Array.from(nodeList);
    if (Math.abs(index) >= nodeList.length) return null;
    if (index < 0) {
      index = nodeList.length + index;
    }
    return (_nodeList$index = nodeList[index]) !== null && _nodeList$index !== void 0 ? _nodeList$index : null;
  },
  /**
   * @param {Element} el
   * @param {Element|string} newEl
   * @returns {Element|null}
   */
  after: function after(el, newEl) {
    if (!el.parentElement) return null;
    if (isString(newEl)) {
      newEl = this.create(newEl);
    }
    return el.parentElement.insertBefore(newEl, el.nextElementSibling);
  },
  /**
   * @param {Element} el
   * @param {Element|string} newEl
   * @returns {Element|null}
   */
  before: function before(el, newEl) {
    if (!el.parentElement) return null;
    if (isString(newEl)) {
      newEl = this.create(newEl);
    }
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
   * @param {Element|NodeList|Array<Element>} el
   * @param {string|Element} selector
   * @return {Array<Element>}
   */
  not: function not(el, selector) {
    var elements = el instanceof Element ? [el] : Array.from(el);
    var selectorIsString = isString(selector);
    return elements.filter(function (e) {
      if (!(e instanceof Element)) return false;
      return selectorIsString ? !e.matches(selector) : e !== selector;
    });
  },
  /**
   * @param {Element} elem1
   * @param {Element} elem2
   * @returns {boolean}
   */
  collide: function collide(elem1, elem2) {
    var rect1 = elem1.getBoundingClientRect();
    var rect2 = elem2.getBoundingClientRect();
    return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
  },
  /**
   * @param {Element} el
   * @param {string|Element} selector
   */
  matches: function matches(el, selector) {
    if (!el) return false;
    return selector instanceof Element ? selector === el : el.matches(selector);
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
   * @param {NodeList|Array<Element>|string[]} children
   * @returns {Element}
   */
  replaceChildren: function replaceChildren(el) {
    var _this7 = this;
    var nodes = [];
    for (var _len4 = arguments.length, children = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      children[_key4 - 1] = arguments[_key4];
    }
    foreach(children, function (child) {
      if (isString(child)) {
        child = _this7.create(child);
      }
      if (child) nodes.push(child);
    });
    el.replaceChildren.apply(el, nodes);
    return el;
  },
  /**
   * @param {Element|Document|Window} el
   * @returns {{top: number, left: number}}
   */
  offset: function offset(el) {
    if (isWindow(el)) {
      return {
        top: el.scrollY,
        left: el.scrollX
      };
    } else if (isDocument(el)) {
      return {
        top: el.documentElement.scrollTop,
        left: el.documentElement.scrollLeft
      };
    }
    var rect = el.getBoundingClientRect();
    var wOffset = this.offset(window);
    return {
      top: rect.top + wOffset.top,
      left: rect.left + wOffset.left
    };
  }
};
if ('test' === process.env.NODE_ENV) {
  dom.__resetCustomEventsForTests = function () {
    var _teardownLongTap2, _teardownDblTap2;
    ENABLED_EVENTS.clear();
    (_teardownLongTap2 = _teardownLongTap) === null || _teardownLongTap2 === void 0 || _teardownLongTap2();
    (_teardownDblTap2 = _teardownDblTap) === null || _teardownDblTap2 === void 0 || _teardownDblTap2();
  };
}
export default dom;