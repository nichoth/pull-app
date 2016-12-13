var test = require('tape')
var S = require('pull-stream')
var shouldUpdate = require('../lib/should-update')

test('should update', function (t) {
    t.plan(2)
    S(
        S.values([1,2,3]),
        shouldUpdate(function (prev, next) {
            return prev + next === 3
        }),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [2], 'should filter the stream')
        })
    )
})
