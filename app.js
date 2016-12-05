var React = require('react')
var reactDom = require('react-dom')
var S = require('pull-stream')
var scan = require('pull-scan')
var router = require('pull-routes')()

var wsStream = require('./mock/socket')()
var api = require('./mock/api')()
var apiStream = require('./lib/api-stream')(api)
var rootView = require('./view/root')
var rootController = require('./ctrl/root')(apiStream)
var rootStore = require('./store/root')()

var wsMap = S.map(function (ev) {
    return {
        type: 'ws',
        data: ev
    }
})
var wss = S(
    wsStream,
    wsMap
)
rootController.add(wss)

var rStream = router([
    ['/', function rootRoute (params) {
        var strms = [
            rootView(),
            rootController(),
            rootStore()
        ]
        return strms
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
    }, function onEnd (err) {
        console.log('error', err)
    })
)
