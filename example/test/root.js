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
    { resolving: 0, data: null, count: 0, ws: null, hasFetched: false },
    { resolving: 1, data: null, count: 0, ws: null, hasFetched: false },
    { resolving: 2, data: null, count: 0, ws: null, hasFetched: false },
    { resolving: 3, data: null, count: 0, ws: null, hasFetched: false },
    { resolving: 3,
        data: 'fetch',
        count: 1,
        ws: null,
        hasFetched: true },
    { resolving: 2,
        data: 'fetch',
        count: 1,
        ws: null,
        hasFetched: true },
    { resolving: 2,
        data: 'udpate',
        count: 2,
        ws: null,
        hasFetched: true },
    { resolving: 1,
        data: 'udpate',
        count: 2,
        ws: null,
        hasFetched: true },
    { resolving: 1,
        data: 'delete',
        count: 3,
        ws: null,
        hasFetched: true },
    { resolving: 0,
        data: 'delete',
        count: 3,
        ws: null,
        hasFetched: true }
]

var mockWs = S.empty()
var api = require('../mock/api')()
var Router = require('../router')(api, mockWs)

test('root route', function (t) {
    t.plan(2)

    var router = Router([
        ['/', function rootTest () {
            return {
                source: S.asyncValues(['a','b','c']),
                // sink: S.log()
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

