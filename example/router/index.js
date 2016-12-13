var S = require('pull-stream')
var Router = require('pull-router')
var ApiStream = require('../lib/api-stream')

function AppRouter (api, wsStream) {
    var apiStream = ApiStream(api)
    var wss = S(
        wsStream,
        S.map(function (ev) {
            return {
                type: 'ws',
                data: ev
            }
        })
    )

    return Router([
        ['/', require('./root')(apiStream, wss)],
        ['/foo', require('./foo')()]
    ])
}

module.exports = AppRouter
