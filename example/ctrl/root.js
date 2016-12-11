var S = require('pull-stream')
var flatMerge = require('pull-flat-merge')
var Ctrl = require('../../ctrl')

var apiMap = {
    a: 'fetch',
    b: 'update',
    c: 'delete'
}

module.exports = function RootController (apiStream) {
    var fetched = false

    var transform = S(
        // map view events to api calls
        S.map(function (ev) {
            return apiMap[ev]
        }),
        // don't re-fetch from the api if we already have data
        S.filter(function (ev) {
            return !(ev === 'fetch' && fetched)
        }),
        apiStream(),
        flatMerge(),
        S.through(function (ev) {
            fetched = !fetched ? ev.type === 'fetch' : fetched
        })
    )

    var controller = Ctrl(transform)
    return controller
}
