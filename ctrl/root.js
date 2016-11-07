var S = require('pull-stream')
var many = require('pull-many')
var cat = require('pull-cat')
var flatMerge = require('pull-flat-merge')


function Add (s) {
    var m = many()

    return function add () {
        var stream = S.through
        m.add(stream)
        return stream
    }
}


module.exports = function (api) {
    return function rootController (params) {
        var apiMap = {
            a: 'fetch',
            b: 'update',
            c: 'delete'
        }

        return S(
            S.map(function (ev) {
                return apiMap[ev]
            }),
            S.map(function (fnName) {
                return { type: 'start', op: fnName }
            }),
            S.map(function (apiEv) {
                return cat([
                    S.once(apiEv),
                    S(
                        S.once(apiEv),
                        S.asyncMap(function (ev, cb) {
                            api[ev.op](function (err, resp) {
                                cb(null, {
                                    type: ev.op,
                                    resp: resp
                                })
                            })
                        })
                    )
                ])
            }),
            flatMerge()
        )
    }
}
