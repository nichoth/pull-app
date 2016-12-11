var xtend = require('xtend')
var Store = require('pull-store')

var reducers = {
    start: function (state, ev) {
        return xtend(state, { resolving: state.resolving + 1 })
    },

    fetch: function (state, ev) {
        return xtend(state, {
            resolving: state.resolving - 1,
            data: ev.resp.data,
            count: state.count + 1,
            hasFetched: true
        })
    },

    update: function (state, ev) {
        return xtend(state, {
            resolving: state.resolving - 1,
            data: ev.resp.data,
            count: state.count + 1
        })
    },

    delete: function (state, ev) {
        return xtend(state, {
            resolving: state.resolving - 1,
            data: ev.resp.data,
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
    var store = Store(function (state, ev) {
        return reducers[ev.type](state, ev)
    }, xtend(initState))
    return store
}

RootStore.reducers = reducers
RootStore.initState = initState
module.exports = RootStore

