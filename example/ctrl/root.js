var S = require('pull-stream')
var Abortable = require('pull-abortable')
var many = require('pull-many')
var flatMerge = require('pull-flat-merge')
var onAbort = require('pull-on-abort')

var apiMap = {
    a: 'fetch',
    b: 'update',
    c: 'delete'
}



// example consumer code
/*
var MyController = Controller(transform)
var ctrl = MyController()
ctrl.add(stream) // this stream is never aborted
S( otherStream, ctrl(), sink )
*/




module.exports = function RootController (apiStream) {
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
                return !(ev === 'fetch' && fetched)
            }),
            apiStream,
            // fnToStream(api),
            flatMerge(),
            S.through(function (ev) {
                fetched = !fetched ? ev.type === 'fetch' : fetched
            })
        )

        // source here is the events from the view
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
