var S = require('pull-stream')

module.exports = function FooRoute () {
    return function fooRoute () {
        // do nothing
        return S.through()
    }
}
