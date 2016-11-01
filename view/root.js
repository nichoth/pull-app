var React = require('react')
var h = React.createElement
var pt = React.PropTypes
var S = require('pull-stream')
var toStream = require('react-pull-stream')

module.exports = function () {
    return toStream(RootView)
}

function RootView (props) {
    var push = props.push
    console.log(props)
    return h('div', {
        className: 'app'
    }, [
        h('h1', {
            key: 'h1',
            style: { opacity: props.resolving ? '0.4' : '1' }
        },
        'state: ' + props.data),
        h('button', { key: 'a', onClick: push.bind(null, 'a') }, 'a'),
        h('button', { key: 'b', onClick: push.bind(null, 'b') }, 'b'),
        h('button', { key: 'c', onClick: push.bind(null, 'c') }, 'c')
    ])
}

RootView.propTypes = {
    resolving: pt.number
}

RootView.defaultProps = {
    resolving: 0,
    data: null
}
