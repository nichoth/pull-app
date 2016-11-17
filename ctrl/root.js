var S = require('pull-stream')
var Abortable = require('pull-abortable')
var many = require('pull-many')
var cat = require('pull-cat')
var flatMerge = require('pull-flat-merge')
var fnToStream = require('../lib/api-stream')

function onAbort (fn) {
    return function sink (read) {
        return function source (abort, cb) {
            if (abort) return read(fn(), cb)
            return read(abort, cb)
        }
    }
}

var apiMap = {
    a: 'fetch',
    b: 'update',
    c: 'delete'
}

module.exports = function RootController (api) {
    var fetched = false
    var m = many()

    function rootController (params) {
        var transform = S(
            // map view events to api calls
            S.map(function (ev) {
                return apiMap[ev]
            }),

            // don't re-fetch from the api if we already have data
            S.filter(function (ev) {
                if ((ev === 'fetch') && fetched) return false
                return true
            }),
            fnToStream(api),
            flatMerge(),
            S.through(function (ev) {
                fetched = !fetched ? ev.type === 'fetch' : fetched
            })
        )

        return function (source) {
            var abortable = Abortable()
            m.add(S(source, transform, abortable))
            return S(
                m,
                onAbort(function () {
                    // abort only the view source, not websocket
                    abortable.abort()
                    return null
                })
            )
        }
    }

    rootController.add = m.add.bind(m)
    return rootController
}
