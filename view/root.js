var React = require('react')
var h = React.createElement
var pt = React.PropTypes
var S = require('pull-stream')
// var pushable = require('pull-pushable')
var toStream = require('react-pull-stream')

module.exports = function () {
    return toStream(RootView)
}

// module.exports = function RootView () {
//     return function rootView () {
//         var p = pushable()
//         var ar = ['a', 'b', 'c']
//         ar.forEach(function (ev) {
//             process.nextTick(() => p.push(ev))
//         })
//         return { source: p, sink: S.log() }
//     }
// }

function RootView (props) {
    var push = props.push

    // var actions = ['a', 'b', 'c']
    // actions.forEach(function (ev) {
    //     process.nextTick(() => push(ev))
    // })

    console.log(props)

    return h('div', {
        className: 'app'
    }, [
        h('button', { key: 'a', onClick: push.bind(null, 'a') }, 'a'),
        h('button', { key: 'b', onClick: push.bind(null, 'b') }, 'b'),
        h('button', { key: 'c', onClick: push.bind(null, 'c') }, 'c')
    ])
}

RootView.propTypes = {
    resolving: pt.number
}
