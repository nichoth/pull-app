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
var mockWs = S.empty()
var api = require('../mock/api')()
var AppRouter = require('../router')(api, mockWs)

test('root route', function (t) {
    t.plan(3)
    var router = AppRouter([
        ['/', function rootTest () {
            return {
                source: S.asyncValues(['a','b','c']),
                sink: S.collect(function (err, res) {
                    t.error(err)
                    // should filter if resolving state has not changed
                    t.deepEqual(res, [
                        { count: 0, data: null, hasFetched: false,
                            resolving: 0, ws: null
                        },
                        { count: 3, data: 'delete', hasFetched: true,
                            resolving: 0, ws: null
                        }
                    ], 'should map view events to app state')
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
    routeStream.end()
})

