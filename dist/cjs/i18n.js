import * as i18n from "./i18n/index.js";
import { isFunction, isUndefined } from "./is.js";
var _translate = function translate(lang, ns, label) {
  var language = lang;
  if (isUndefined(label)) {
    if (isUndefined(ns)) {
      label = lang;
      ns = 'core';
    } else {
      label = ns;
      ns = lang;
    }
    language = getLang();
  }
  var translationExists = !isUndefined(i18n[ns]) && !isUndefined(i18n[ns][language]) && !isUndefined(i18n[ns][language][label]);
  if (translationExists) {
    var tr = i18n[ns][language][label];
    return isFunction(tr) ? tr() : tr;
  }
  if (lang !== 'en') {
    return _translate('en', ns, label);
  }
  return label;
};
export { _translate as translate };
export var _ = _translate;
var _lang;
export var getLang = function getLang() {
  if (!_lang) setLang();
  return _lang;
};
export var setLang = function setLang(lang) {
  if (!lang) {
    if (typeof navigator !== 'undefined' && navigator.language) {
      lang = navigator.language;
    } else if (typeof process !== 'undefined' && process.env) {
      lang = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES;
    }
  }
  _lang = (lang || 'en').trim().toLowerCase().slice(0, 2);
};