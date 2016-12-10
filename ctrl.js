var S = require('pull-stream/pull')
var through = require('pull-stream/throughs/through')
var many = require('pull-many')
var onAbort = require('pull-on-abort')
var Abortable = require('pull-abortable')

function Controller (transform) {
    transform = transform || through()
    var m = many()

    function controller (_transform) {
        _transform = _transform || through()
        var t = S(transform, _transform)
        // source here is the event stream from the view
        return function (source) {
            var abortable = Abortable()
            m.add(S(source, t, abortable))
            return S(
                m,
                onAbort(function () {
                    // abort only the source passed in above, not
                    // streams added with `controller.add()`
                    abortable.abort()
                    return null
                })
            )
        }
    }

    controller.add = m.add.bind(m)
    controller.cap = m.cap.bind(m)
    return controller
}

module.exports = Controller
