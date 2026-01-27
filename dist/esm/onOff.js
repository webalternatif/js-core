function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { isFunction, isTouchDevice } from "./is.js";
import { foreach, map } from "./traversal.js";
import { inArray } from "./array.js";
import Mouse from "./Mouse.js";
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
  var MOVE_TOLERANCE = 40;
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
    // if (!timer) return;

    var pos = Mouse.getViewportPosition(ev);
    if (Math.hypot(pos.x - startX, pos.y - startY) > MOVE_TOLERANCE) {
      clearTimeout(timer);
      timer = null;
    }
  };
  var end = function end() {
    clearTimeout(timer);
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
 * @param {Element} target
 * @param {Element} el
 * @returns {Element[]}
 */
function buildTree(target, el) {
  var path = [];
  var node = target.nodeType === 3 ? target.parentElement : target;
  while (node) {
    path.push(node);
    if (node === el) break;
    node = node.parentElement;
  }
  return path;
}
function createWrappedEvent(ev, currentTarget) {
  var wrappedEv = {
    _immediateStopped: false,
    _propagationStopped: false,
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
      wrappedEv._propagationStopped = true;
      ev.stopPropagation.apply(ev, arguments);
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
      wrappedEv._immediateStopped = true;
      wrappedEv._propagationStopped = true;
      ev.stopImmediatePropagation.apply(ev, arguments);
    }
  };
  return wrappedEv;
}

/**
 * @param {Element|Document|Window} el
 * @param {string} events
 * @param {string|Element|function} selector
 * @param {function|AddEventListenerOptions|boolean} [handler]
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {Element}
 */
export function on(el, events, selector, handler, options) {
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
      if (ev.cancelBubble) return;
      var tree = buildTree(ev.target, el);
      var binds = _toConsumableArray(LISTENERS.get(el));
      var _iterator = _createForOfIteratorHelper(tree),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var node = _step.value;
          var propagationStoppedOnThisNode = false;
          var _iterator2 = _createForOfIteratorHelper(binds),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var bind = _step2.value;
              if (bind.event !== ev.type) continue;
              if (bind.selector) {
                if (!node.matches(bind.selector)) continue;
              } else {
                if (node !== el) continue;
              }
              var wrappedEv = createWrappedEvent(ev, node);
              bind.handler.call(node, wrappedEv);
              if (wrappedEv._immediateStopped) return;
              if (wrappedEv._propagationStopped) {
                propagationStoppedOnThisNode = true;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          if (propagationStoppedOnThisNode) return;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };
    var store = LISTENERS.get(el);
    if (!store) {
      store = [];
      LISTENERS.set(el, store);
    }
    if (inArray(event, CUSTOM_EVENTS)) {
      supplyEvent(event);
    }
    var events = map(store, function (_, entry) {
      return entry.event;
    });
    if (!inArray(event, events)) {
      el.addEventListener(event, listener, options);
    }
    store.push({
      event: event,
      handler: handler,
      selector: selector,
      listener: listener,
      namespace: namespace,
      options: options
    });
  });
  return el;
}

/**
 * @param {Element|Document|Window} el
 * @param {string} [events]
 * @param {string|Element|function} [selector]
 * @param {function|AddEventListenerOptions|boolean} [handler]
 * @param {AddEventListenerOptions|boolean} [options]
 * @returns {Element}
 */
export function off(el, events, selector, handler, options) {
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
        var index = store.indexOf(l);
        index !== -1 && store.splice(index, 1);
        if (!map(store, function (_, entry) {
          return entry.event === event ? entry : null;
        })[0]) el.removeEventListener(l.event, l.listener, l.options);
      }
    });
  });
  return el;
}
export function __resetCustomEventsForTests() {
  var _teardownLongTap2, _teardownDblTap2;
  ENABLED_EVENTS.clear();
  (_teardownLongTap2 = _teardownLongTap) === null || _teardownLongTap2 === void 0 || _teardownLongTap2();
  (_teardownDblTap2 = _teardownDblTap) === null || _teardownDblTap2 === void 0 || _teardownDblTap2();
}