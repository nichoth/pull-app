var React = require('react')
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
    var actions = ['a', 'b', 'c']
    actions.forEach(function (ev) {
        process.nextTick(() => push(ev))
    })

    return React.createElement('div', {
        className: 'app'
    }, 'root view')
}

RootView.propTypes = {
    resolving: pt.number
}
