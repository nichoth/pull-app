var test = require('tape')
var S = require('pull-stream')
S.asyncValues = function (arr) {
    return S(
        S.values(arr),
        S.asyncMap(function (ev, cb) {
            process.nextTick(cb.bind(null, null, ev))
        })
    )
}

var expected = [
    {
        'count': 0,
        'data': null,
        'hasFetched': false,
        'resolving': 0,
        'ws': null
    },
    {
        'count': 0,
        'data': null,
        'hasFetched': false,
        'resolving': 1,
        'ws': null
    },
    {
        'count': 0,
        'data': null,
        'hasFetched': false,
        'resolving': 2,
        'ws': null
    },
    {
        'count': 0,
        'data': null,
        'hasFetched': false,
        'resolving': 3,
        'ws': null
    },
    {
        'count': 1,
        'data': 'fetch',
        'hasFetched': true,
        'resolving': 2,
        'ws': null
    },
    {
        'count': 2,
        'data': 'udpate',
        'hasFetched': true,
        'resolving': 1,
        'ws': null
    },
    {
        'count': 3,
        'data': 'delete',
        'hasFetched': true,
        'resolving': 0,
        'ws': null
    }
]

var mockWs = S.empty()
var Router = require('../router')(require('../mock/api')(), mockWs)

test('root route', function (t) {
    t.plan(2)

    var router = Router([
        ['/', function rootTest () {
            return {
                source: S.asyncValues(['a','b','c']),
                // sink: S.drain(function onEvent (ev) {
                //     console.log('root', ev)
                // })
                sink: S.collect(function (err, res) {
                    t.error(err)
                    t.deepEqual(res, expected,
                        'should map view events to app state')
                })
            }
        }]
    ])

    var routeStream = router()
    S(
        routeStream,
        S.collect(function (err, res) {
            t.error(err)
        })
    )
    routeStream.push('/')
})

module.exports = {
    expected: expected
}
