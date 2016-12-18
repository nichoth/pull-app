var xtend = require('xtend')
// var Store = require('pull-store')
var Store = require('../../store')

var reducers = {
    start: function (state, ev) {
        return xtend(state, { resolving: state.resolving + 1 })
    },

    resolve: function (state, ev) {
        return xtend(state, { resolving: state.resolving - 1 })
    },

    fetch: function (state, ev) {
        return xtend(state, {
            data: ev.data,
            count: state.count + 1,
            hasFetched: true
        })
    },

    update: function (state, ev) {
        return xtend(state, {
            data: ev.data,
            count: state.count + 1
        })
    },

    delete: function (state, ev) {
        return xtend(state, {
            data: ev.data,
            count: state.count + 1
        })
    },

    ws: function (state, ev) {
        // ignore websocket until we have fetched data
        return state.hasFetched ?
            xtend(state, {
                ws: ev.data
            }) :
            state
    }
}

var initState = { resolving: 0, data: null, count: 0, ws: null,
    hasFetched: false
}

function RootStore () {
    var store = Store(reducers, xtend(initState))
    return store
}

RootStore.reducers = reducers
RootStore.initState = initState
module.exports = RootStore

