"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _is = require("./is.js");
var _traversal = require("./traversal.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
/**
 * @typedef {string|(()=>string)} TranslatorValue
 */
/**
 * @typedef {Record<string,Record<string,Record<string,TranslatorValue>>>} TranslatorNsMapping
 */
/**
 * @typedef {Record<string,Record<string,TranslatorValue>>} TranslatorCoreMapping
 */
/**
 * @typedef {TranslatorNsMapping | TranslatorCoreMapping} TranslatorMapping
 */
var _lang = /*#__PURE__*/new WeakMap();
var _mapping = /*#__PURE__*/new WeakMap();
var _Translator_brand = /*#__PURE__*/new WeakSet();
var Translator = exports["default"] = /*#__PURE__*/function () {
  /**
   * @param {TranslatorMapping} mapping
   * @param {string} [defaultLang]
   */
  function Translator(_mapping2, defaultLang) {
    _classCallCheck(this, Translator);
    _classPrivateMethodInitSpec(this, _Translator_brand);
    /** @type string */
    _classPrivateFieldInitSpec(this, _lang, void 0);
    /** @type TranslatorMapping */
    _classPrivateFieldInitSpec(this, _mapping, void 0);
    _assertClassBrand(_Translator_brand, this, _setMapping).call(this, _mapping2);
    this.setLang(defaultLang);
  }
  return _createClass(Translator, [{
    key: "translate",
    value:
    /**
     * @param {string} label
     * @param {string} [lang]
     * @param {string} [namespace='core']
     * @returns {string}
     */
    function translate(label, lang) {
      var namespace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'core';
      lang = undefined === lang ? this.getLang() : lang;
      var translationExists = undefined !== _classPrivateFieldGet(_mapping, this)[namespace] && undefined !== _classPrivateFieldGet(_mapping, this)[namespace][lang] && undefined !== _classPrivateFieldGet(_mapping, this)[namespace][lang][label];
      if (translationExists) {
        var entry = _classPrivateFieldGet(_mapping, this)[namespace][lang][label];
        return _assertClassBrand(_Translator_brand, this, _resolve).call(this, entry);
      }
      return 'en' !== lang ? this.translate(label, 'en', namespace) : label;
    }

    /**
     * @param {string} label
     * @param {string} from - Language from.
     * @param {string} to - Language to.
     * @param {string} [namespace='core']
     */
  }, {
    key: "translateFrom",
    value: function translateFrom(label, from, to) {
      var _classPrivateFieldGet2;
      var namespace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'core';
      if (!label) return label;
      var mapNs = (_classPrivateFieldGet2 = _classPrivateFieldGet(_mapping, this)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2[namespace];
      if (!mapNs) return label;
      var mapFrom = mapNs === null || mapNs === void 0 ? void 0 : mapNs[from];
      var mapTo = mapNs === null || mapNs === void 0 ? void 0 : mapNs[to];
      if (!mapFrom || !mapTo) return label;
      var key = _assertClassBrand(_Translator_brand, this, _findKeyByValue).call(this, mapFrom, label);
      if (!key) return label;
      var entryTo = mapTo[key];
      var resolvedTo = _assertClassBrand(_Translator_brand, this, _resolve).call(this, entryTo);
      return resolvedTo !== null && resolvedTo !== void 0 ? resolvedTo : label;
    }
  }, {
    key: "_",
    value: function _() {
      return this.translate.apply(this, arguments);
    }
  }, {
    key: "getLang",
    value: function getLang() {
      return _classPrivateFieldGet(_lang, this);
    }
  }, {
    key: "setLang",
    value: function setLang(lang) {
      if (!lang) {
        if (typeof navigator !== 'undefined' && navigator.language) {
          lang = navigator.language;
        } else if (typeof process !== 'undefined' && process.env) {
          lang = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES;
        }
      }
      _classPrivateFieldSet(_lang, this, (lang || 'en').trim().toLowerCase().slice(0, 2));
    }
  }]);
}();
function _setMapping(mapping) {
  var nsMapping = {},
    coreMapping = {};
  (0, _traversal.each)(mapping, function (ns, langs) {
    (0, _traversal.each)(langs, function (lang, trads) {
      if ((0, _is.isPlainObject)(trads)) {
        if (undefined === nsMapping[ns]) nsMapping[ns] = {};
        nsMapping[ns][lang] = trads;
      } else {
        if (undefined === coreMapping[ns]) coreMapping[ns] = {};
        coreMapping[ns][lang] = trads;
      }
    });
  });
  _classPrivateFieldSet(_mapping, this, (0, _traversal.extend)(true, nsMapping, {
    core: (0, _traversal.extend)({}, nsMapping.core || {}, coreMapping)
  }));
}
function _findKeyByValue(entries, label) {
  for (var key in entries) {
    var resolved = _assertClassBrand(_Translator_brand, this, _resolve).call(this, entries[key]);
    if (resolved === label) return key;
  }
  return null;
}
function _resolve(entry) {
  if ((0, _is.isFunction)(entry)) {
    return entry();
  }
  return entry;
}