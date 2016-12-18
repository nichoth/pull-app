var test = require('tape')
var api = require('../mock/api')()
var apiStream = require('../lib/api-stream')(api)
var Controller = require('../ctrl/root')
var S = require('pull-stream')

test('root controller', function (t) {
    t.plan(2)
    var controller = Controller(apiStream)
    controller.cap()
    S(
        S.values(['a', 'b', 'c']),
        controller(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                [ 'start', { op: 'fetch' } ],
                [ 'start', { op: 'update' } ],
                [ 'start', { op: 'delete' } ],
                [ 'fetch', { data: 'fetch' } ],
                [ 'resolve', { op: 'fetch' } ],
                [ 'update', { data: 'udpate' } ],
                [ 'resolve', { op: 'update' } ],
                [ 'delete', { data: 'delete' } ],
                [ 'resolve', { op: 'delete' } ]
            ], 'should map view actions to api calls')
        })
    )
})
