var test = require('tape')
var S = require('pull-stream')
var Store = require('../store')

var ops = {
    a: {
        b: function (state, data) {
            return data + ' b'
        },
        c: function (state, data) {
            return state +  ' ' + data[0] + ' ' + data[1]
        }
    },
    d: function (state, data) {
        return state
    }
}

var events = [
    ['a', 'b', 'test'],
    ['a', 'c', ['c1', 'c2']],
    ['d']
]

test('store', function (t) {
    t.plan(2)
    var store = Store(ops, '')
    S(
        S.values(events),
        store(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                '',
                'test b',
                'test b c1 c2',
                'test b c1 c2',
            ], 'should update state')
        })
    )
})
