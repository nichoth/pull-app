var React = require('react')
var reactDom = require('react-dom')
var S = require('pull-stream')
var Router = require('./router')()
var rootView = require('./view/root')


var router = Router([
    ['/', function rootRoute (params) {
        return rootView()
    }],
    ['/foo', function fooRoute (params) {
        return require('./view/foo')()
    }]
])

var el = document.createElement('div')
document.body.appendChild(el)

var rtStream = router()
S(
    rtStream,
    S.drain(function render (view) {
        reactDom.render(React.createElement(view), el)
    }, function onEnd (err) {
        console.log('error', err)
    })
)

