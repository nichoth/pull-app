var React = require('react')
var reactDom = require('react-dom')
var S = require('pull-stream')
var scan = require('pull-scan')
var router = require('pull-routes')()

var api = require('./mock/api')()
var rootView = require('./view/root')()
var rootController = require('./ctrl/root')(api)
var rootStore = require('./store/root')()

var rStream = router([
    ['/', function rootRoute (params) {
        return [
            rootView,
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
        // map from array of streams to transform stream
        var view = ss[0]
        return S( view, ss.slice(1) )
    }),
    S.map(function (state) {
        return React.createElement(view(state))
        // return someViewThing(state)
    }),
    S.drain(function onChange (view) {
        reactDom.render(React.createElement(view), el)
    })
)
