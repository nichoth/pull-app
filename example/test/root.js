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

var Router = require('../router')(require('../mock/api')())

test('root route', function (t) {
    t.plan(1)

    var router = Router([
        ['/', function rootTest () {
            return {
                source: S.asyncValues(['a', 'b', 'c']),
                sink: S.collect(function (err, res) {
                    t.error(err)
                    t.deepEqual(res, [
                    ], 'should map view events to app state')
                })
            }
        }]
    ])

    var source = router.source()
    S(
        source,
        router.match(),
        S.collect(function (err, res) {
        })
    )
})
