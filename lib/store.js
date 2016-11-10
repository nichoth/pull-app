var S = require('pull-stream')
var scan = require('pull-scan')
var cat = require('pull-cat')

// fn that returns a stream that emits the most recent value
function State (reducer, init) {
    var state = init

    return function stateStream () {
        var transform = S(
            scan(reducer, state),
            S.through(function (newState) {
                state = newState
            })
        )

        return function sink (source) {
            var live = S(source, transform)
            return cat([S.once(state), live])
        }
    }
}

module.exports = State
