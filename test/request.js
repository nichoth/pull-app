var test = require('tape')
var S = require('pull-stream')
var flatMerge = require('pull-flat-merge')
var request = require('../request')

function async (time, arg, cb) {
    setTimeout(function () {
        cb(null, arg)
    }, time)
}

var reqs = {
    'a': request(async.bind(null, 100)),
    'b': request(async.bind(null, 10))
}

test('request', function (t) {
    t.plan(2)
    S(
        S.values(['a', 'b']),
        S.map(function (ev) {
            return reqs[ev](ev)
        }),
        flatMerge(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, ['b', 'a'], 'should return the values')
        })
    )
})

