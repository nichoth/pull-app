var React = require('react')
var h = React.createElement
var pt = React.PropTypes
var toStream = require('react-pull-stream')

module.exports = function () {
    return toStream(RootView)
}

function RootView (props) {
    var push = props.push

    return h('div', {
        className: 'app'
    }, [
        h('h1', {
            key: 'h1',
            style: { opacity: props.resolving ? '0.4' : '1' }
        },
        'api: ' + props.data + ', count: ' + props.count),
        h('h2', { key: 'h2' }, 'websocket: ' + props.ws),
        h('button', { key: 'a', onClick: push.bind(null, 'a') }, 'a'),
        h('button', { key: 'b', onClick: push.bind(null, 'b') }, 'b'),
        h('button', { key: 'c', onClick: push.bind(null, 'c') }, 'c'),
        h('a', { key: 'link', href: '/foo' }, 'foo')
    ])
}

RootView.propTypes = {
    resolving: pt.number,
    data: pt.string,
    ws: pt.number,
    resolving: pt.number
}

RootView.defaultProps = {
    resolving: 0,
    count: 0,
    ws: null,
    data: null
}
