var S = require('pull-stream')
var React = require('react')
var reactDom = require('react-dom')
var rootView = require('./view/root')
var Api = require('./mock/api')
var WsStream = require('./mock/socket')
var Router = require('./router')(Api(), WsStream())

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

