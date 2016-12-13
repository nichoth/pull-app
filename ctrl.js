var S = require('pull-stream/pull')
var through = require('pull-stream/throughs/through')
var many = require('pull-many')
var onAbort = require('pull-on-abort')
var Abortable = require('pull-abortable')

function Controller (transform) {
    transform = transform || through
    var m = many()
    function controller () {
        return function stream (source) {
            var abortable = Abortable()
            m.add(S(source, transform(), abortable))
            return S(
                m,
                onAbort(function () {
                    // abort only the view source, not websocket
                    abortable.abort()
                    return null
                })
            )
        }
    }
    controller.add = m.add.bind(m)
    controller.cap = m.cap.bind(m)
    // abort all sources
    // controller.end =
    return controller
}

module.exports = Controller

