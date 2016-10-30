var S = require('pull-stream')
var scan = require('pull-scan')
var xtend = require('xtend')

var reducers = {
    start: function (state, ev) {
        return xtend(state, { resolving: state.resolving + 1 })
    },
    fetch: function (state, ev) {
        return {
            resolving: state.resolving - 1,
            data: ev.resp.data
        }
    },
    update: function (state, ev) {
        return {
            resolving: state.resolving - 1,
            data: ev.resp.data
        }
    },
    delete: function (state, ev) {
        return {
            resolving: state.resolving - 1,
            data: ev.resp.data
        }
    }
}

module.exports = function () {
    return function rootStore (params) {
        return scan(function (state, ev) {
            return reducers[ev.type](state, ev)
        }, { resolving: 0, data: null })
    }
}

