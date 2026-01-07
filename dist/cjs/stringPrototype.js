import { each } from "./traversal.js";
import * as stringFunctions from "./string.js";
each(Object.keys(stringFunctions), function (i, name) {
  var f = stringFunctions[name],
    p = String.prototype;
  var origSF = p[name];
  p[name] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (origSF && args.length === origSF.length) {
      return origSF.apply(this, args);
    }
    return f.apply(void 0, [this].concat(args));
  };
});