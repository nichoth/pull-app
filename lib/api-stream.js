var S = require('pull-stream')
var cat = require('pull-cat')

// take a map from names to fns
// return a transform stream mapping keys to streams,
// where each stream emits
//  { type: 'start', op: key }
//  { type: key, resp: apiResponse }
module.exports = function (fnMap) {
    return S(
        S.map(function (key) {
            var startEv = { type: 'start', op: key }
            return startEv
        }),

        S.map(function (startEv) {
            return cat([
                S.once(startEv),
                S(
                    S.once(startEv),
                    S.asyncMap(function (ev, cb) {
                        fnMap[ev.op](function (err, resp) {
                            cb(err, {
                                type: ev.op,
                                resp: resp
                            })
                        })
                    })
                )
            ])
        })
    )
}
