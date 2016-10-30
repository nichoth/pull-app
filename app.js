var React = require('react')
var reactDom = require('react-dom')
var S = require('pull-stream')
var router = require('pull-routes')()

var api = require('./mock/api')()
var rootView = require('./view/root')()
var rootController = require('./ctrl/root')(api)
var rootStore = require('./store/root')()

var viewStream = router({
    '/': function rootRoute (params) {
        return [
            rootView,
            rootController(),
            rootStore()
        ]
    }
})

var el = document.createElement('div')
document.body.appendChild(el)

S(
    viewStream,
    S.drain(function onChange (view) {
        reactDom.render(React.createElement(view), el)
    })
)
