var React = require('react')
var h = React.createElement
var toStream = require('react-pull-stream')

function Foo (props) {
    return h('h1', {}, 'Foo')
}

module.exports = function () { return toStream(Foo) }

