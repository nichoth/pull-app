var React = require('react')
var reactDom = require('react-dom')
var S = require('pull-stream')
var scan = require('pull-scan')
var router = require('pull-routes')()

var api = require('./mock/api')()
var rootView = require('./view/root')
var rootController = require('./ctrl/root')(api)
var rootStore = require('./store/root')()

var rStream = router([
    ['/', function rootRoute (params) {
        return [
            rootView(),
            rootController(),
            rootStore()
        ]
    }]
])

var el = document.createElement('div')
document.body.appendChild(el)
S(
    rStream,
    scan(function (prev, next) {
        if (prev) prev[0].abort()
        return next.fn(next.params)
    }, null),
    S.map(function (ss) {
        var view = ss[0]
        var transform = S.apply(null, ss.slice(1, ss.length))
        S( view, transform, view )
        return view.view
    }),
    S.drain(function onChange (view) {
        reactDom.render(React.createElement(view), el)
    })
)
