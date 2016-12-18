var test = require('tape')
var S = require('pull-stream')
var api = require('../mock/api')()
var ApiStream = require('../lib/api-stream')
var flatMerge = require('pull-flat-merge')

test('api stream', function (t) {
    t.plan(2)
    var apiStream = ApiStream(api)
    S(
        S.values(['fetch', 'update', 'delete']),
        S.map(apiStream),
        flatMerge(),
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
            ], 'should map events to api calls')
        })
    )
})
