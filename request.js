var fromCb = require('pull-async')

function Request (fn) {
    return function request () {
        var args = Array.prototype.slice.call(arguments)
        return fromCb(function (cb) {
            fn.apply(null, args.concat(cb))
        })
    }
}

module.exports = Request
