var S = require('pull-stream')
var Router = require('pull-router')
var RootController = require('./ctrl/root')
var RootStore = require('./store/root')
var ApiStream = require('./lib/api-stream')

module.exports = function AppRouter (api, wsStream) {
    var apiStream = ApiStream(api)
    var rootStore = RootStore()
    var rootController = RootController(apiStream)

    var wsMap = S.map(function (ev) {
        return {
            type: 'ws',
            data: ev
        }
    })
    var wss = S(
        wsStream,
        wsMap
    )
    rootController.add(wss)

    return Router([
        ['/', function rootRoute (params, rt) {
            // transform stream
            var strms = S(
                rootController(),
                rootStore()
            )
            return strms
        }],
        ['/foo', function fooRoute (params) {
            // do nothing
            return S.through()
        }]
    ])
}

