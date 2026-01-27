import { foreach } from './traversal.js'
import * as stringFunctions from './string.js'

foreach(Object.keys(stringFunctions), (name) => {
    const f = stringFunctions[name],
        p = String.prototype

    const origSF = p[name]
    p[name] = function (...args) {
        if (origSF && args.length === origSF.length) {
            return origSF.apply(this, args)
        }

        return f(this, ...args)
    }
})
