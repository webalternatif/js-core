"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqid = exports.randNum = exports.randAlphaNumCs = exports.randAlphaNum = exports.randAlphaCs = exports.randAlpha = exports.rand = void 0;
var randAlpha = exports.randAlpha = function randAlpha(n) {
  return rand('abcdefghijklmnopqrstuvwxyz'.split(''), n);
};
var randAlphaCs = exports.randAlphaCs = function randAlphaCs(n) {
  return rand('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), n);
};
var randAlphaNum = exports.randAlphaNum = function randAlphaNum(n) {
  return rand('0123456789abcdefghijklmnopqrstuvwxyz'.split(''), n);
};
var randAlphaNumCs = exports.randAlphaNumCs = function randAlphaNumCs(n) {
  return rand('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), n);
};
var randNum = exports.randNum = function randNum(n) {
  return rand('0123456789'.split(''), n);
};
var rand = exports.rand = function rand(range, n) {
  var rand = '';
  for (var i = 0; i < n; i++) {
    rand += range[Math.floor(Math.random() * 1000) % range.length];
  }
  return rand;
};
var uniqid = exports.uniqid = function () {
  var uid = 0;
  return function () {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    uid++;
    return "".concat(prefix).concat(Date.now().toString(36), "_").concat(uid.toString(36), "_").concat(randAlphaNum(5));
  };
}();