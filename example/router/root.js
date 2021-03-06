var S = require('pull-stream')
var RootController = require('../ctrl/root')
var RootStore = require('../store/root')
var shouldUpdate = require('../../should-update')

module.exports = function RootRoute (apiStream, wss) {
    var rootStore = RootStore()
    var rootController = RootController(apiStream)
    rootController.add(wss)

    return function rootRoute (params, route) {
        // transform stream
        var strms = S(
            rootController(),
            rootStore(),
            shouldUpdate(function (prev, next) {
                return prev === null ?
                    true :
                    prev.resolving > 0 ?
                    next.resolving === 0 :
                    true
            })
        )
        // change this? do it automatically in the router?
        rootController.cap()
        return strms
    }
}

