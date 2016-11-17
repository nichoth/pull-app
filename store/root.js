var S = require('pull-stream')
var scan = require('pull-scan')
var xtend = require('xtend')
var cat = require('pull-cat')

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
        // return xtend(state, {
        //     ws: ev.data
        // })

        // ignore websocket until we have fetched data
        return state.hasFetched ?
            xtend(state, {
                ws: ev.data
            }) :
            state
    }
}

module.exports = function RootStore () {
    var state = { resolving: 0, data: null, count: 0, ws: null,
        hasFetched: false
    }

    return function rootStore (params) {
        var transform = S(
            scan(function (state, ev) {
                return reducers[ev.type](state, ev)
            }, state),
            S.through(function (_state) {
                state = _state
            })
        )

        // immediately emit the most recent value
        return function sink (source) {
            var live = S(source, transform)
            return cat([S.once(state), live])
        }
    }
}

