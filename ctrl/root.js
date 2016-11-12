var S = require('pull-stream')
var many = require('pull-many')
var cat = require('pull-cat')
var flatMerge = require('pull-flat-merge')
var fnToStream = require('../lib/api-stream')

module.exports = function RootController (api) {
    return function rootController (params) {
        var apiMap = {
            a: 'fetch',
            b: 'update',
            c: 'delete'
        }

        // map view events to api calls
        return S(
            S.map(function (ev) {
                return apiMap[ev]
            }),
            fnToStream(api),
            flatMerge()
        )
    }
}
