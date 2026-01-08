export var randAlpha = function randAlpha(n) {
  return rand("abcdefghijklmnopqrstuvwxyz".split(''), n);
};
export var randAlphaCs = function randAlphaCs(n) {
  return rand("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''), n);
};
export var randAlphaNum = function randAlphaNum(n) {
  return rand("0123456789abcdefghijklmnopqrstuvwxyz".split(''), n);
};
export var randAlphaNumCs = function randAlphaNumCs(n) {
  return rand("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''), n);
};
export var randNum = function randNum(n) {
  return rand("0123456789".split(''), n);
};
export var rand = function rand(range, n) {
  var rand = "";
  for (var i = 0; i < n; i++) {
    rand += range[Math.floor(Math.random() * 1000) % range.length];
  }
  return rand;
};
export var uniqid = function () {
  var uid = 0;
  return function () {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    uid++;
    return "".concat(prefix).concat(Date.now().toString(36), "_").concat(uid.toString(36), "_").concat(randAlphaNum(5));
  };
}();