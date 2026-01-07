function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
import { isFunction, isString, isUndefined } from "./is.js";
import { each, map } from "./traversal.js";
var _listeners = /*#__PURE__*/new WeakMap();
var EventDispatcher = /*#__PURE__*/function () {
  function EventDispatcher() {
    _classCallCheck(this, EventDispatcher);
    _classPrivateFieldInitSpec(this, _listeners, {});
  }
  return _createClass(EventDispatcher, [{
    key: "addListener",
    value: function addListener(eventsName, callback, context) {
      var _this = this;
      if (!isFunction(callback)) {
        throw new Error('Callback must be a function.');
      }
      if (!isString(eventsName)) {
        throw new Error('Events name must be a string separated by comma.');
      }
      for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }
      var listener = {
        callback: callback,
        context: context,
        args: args
      };
      each(eventsName.split(','), function (i, eventName) {
        if (!eventName) return true; // continue

        eventName = eventName.trim();
        if (_this.hasListener(eventName)) {
          _classPrivateFieldGet(_listeners, _this)[eventName].push(listener);
        } else {
          _classPrivateFieldGet(_listeners, _this)[eventName] = [listener];
        }
      });
      return this;
    }
  }, {
    key: "addListenerOnce",
    value: function addListenerOnce(eventsName, callback, context) {
      var _this2 = this;
      for (var _len2 = arguments.length, listenerArgs = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        listenerArgs[_key2 - 3] = arguments[_key2];
      }
      each(eventsName.split(','), function (i, eventName) {
        eventName = eventName.trim();
        if (!eventName) return true; // continue

        var _handler = function handler() {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }
          callback.apply(context, [eventName].concat(listenerArgs).concat(args.slice(1)));
          _this2.removeListener(eventName, _handler);
        };
        _this2.addListener(eventName, _handler, context);
      });
      return this;
    }
  }, {
    key: "dispatch",
    value: function dispatch(eventsName) {
      var _this3 = this;
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      if (!isString(eventsName)) {
        throw new Error('Events name must be a string seperated by comma.');
      }
      each(eventsName.split(','), function (i, eventName) {
        eventName = eventName.trim();
        if (!eventName) return true; // continue

        if (!_this3.hasListener(eventName)) {
          console.warn("No listeners found for event: ".concat(eventName));
          return true; // continue
        }
        each(_classPrivateFieldGet(_listeners, _this3)[eventName], function (i, listener) {
          listener.callback.apply(listener.context, [eventName].concat(listener.args).concat(args));
        });
      });
      return this;
    }
  }, {
    key: "hasListener",
    value: function hasListener(eventName, callback, context) {
      if (isUndefined(callback)) {
        return !isUndefined(_classPrivateFieldGet(_listeners, this)[eventName]);
      }
      return !!map(_classPrivateFieldGet(_listeners, this)[eventName], function (i, listener) {
        return listener.callback === callback && listener.context === context ? true : null;
      }).length;
    }
  }, {
    key: "removeListener",
    value: function removeListener(eventName, callback, context) {
      var _this4 = this;
      if (this.hasListener(eventName, callback, context)) {
        if (isUndefined(callback)) {
          _classPrivateFieldGet(_listeners, this)[eventName].splice(0);
        } else {
          each(_classPrivateFieldGet(_listeners, this)[eventName], function (i) {
            _classPrivateFieldGet(_listeners, _this4)[eventName].splice(i, 1);
            delete _classPrivateFieldGet(_listeners, _this4)[eventName];
            return false; // break
          });
        }
      }
      return this;
    }
  }, {
    key: "getListeners",
    value: function getListeners(eventName) {
      return eventName ? _classPrivateFieldGet(_listeners, this)[eventName] || [] : _classPrivateFieldGet(_listeners, this);
    }
  }, {
    key: "reset",
    value: function reset() {
      _classPrivateFieldSet(_listeners, this, {});
    }
  }]);
}();
var eventDispatcher = new EventDispatcher();
export default eventDispatcher;