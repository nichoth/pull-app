var React = require('react')
var reactDom = require('react-dom')
var S = require('pull-stream')
var scan = require('pull-scan')
var router = require('pull-routes')()

var websocket = require('./mock/socket')()
var api = require('./mock/api')()
var rootView = require('./view/root')
var rootController = require('./ctrl/root')(api, websocket)
var rootStore = require('./store/root')()

S( websocket, S.log() )

var rStream = router([
    ['/', function rootRoute (params) {
        return [
            rootView(),
            rootController(),
            rootStore()
        ]
    }],
    ['/foo', function fooRoute (params) {
        return [
            require('./view/foo')()
        ]
    }]
])

var el = document.createElement('div')
document.body.appendChild(el)
S(
    rStream,
    scan(function unsubscribe (prev, next) {
        if (prev) prev[0].sink.abort()
        return next.fn(next.params)
    }, null),
    S.map(function subscribe (ss) {
        var view = ss[0]
        var transform = S.apply(null, ss.slice(1, ss.length))
        if (transform) S( view, transform, view )
        else S(view, view)
        return view.view
    }),
    S.drain(function render (view) {
        reactDom.render(React.createElement(view), el)
    })
)
