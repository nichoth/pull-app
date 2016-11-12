var S = require('pull-stream')
var many = require('pull-many')
var cat = require('pull-cat')
var flatMerge = require('pull-flat-merge')
var fnToStream = require('../lib/api-stream')

var apiMap = {
    a: 'fetch',
    b: 'update',
    c: 'delete'
}

module.exports = function RootController (api) {
    var fetched = false
    var m = many()

    return function rootController (params) {

        return S(
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
    }
}
