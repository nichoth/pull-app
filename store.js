var PullStore = require('pull-store')

function Store (ops, initState) {
    return PullStore(function (state, ev) {
        var node = select(ops, ev)
        var fn = node[0]
        var args = node[1]
        return fn.apply(null, [state].concat([args]))
    }, initState)
}

function select (tree, arr) {
    var _arr = [].concat(arr)
    var node = tree[_arr.shift()]
    if (typeof node === 'function') {
        return [node].concat(_arr)
    }
    if (node === undefined) throw new Error('invalid path')
    return select(node, _arr)
}

module.exports = Store
