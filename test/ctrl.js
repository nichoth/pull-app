var test = require('tape')
var S = require('pull-stream')
var Abortable = require('pull-abortable')
var Pushable = require('pull-pushable')
var Controller = require('../ctrl')

test('controller', function (t) {
    t.plan(2)
    var controller = Controller()
    controller.cap()
    S(
        S.values([1,2,3]),
        controller(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [1,2,3], 'should return a through stream')
        })
    )
})

test('abort source streams', function (t) {
    t.plan(4)
    var p = Pushable(function onEnd (err) {
        t.error(err)
        t.pass('should abort this source')
    })
    var p2 = Pushable(function onEnd (err) {
        t.fail('should not abort this source')
    })
    var ctrl = Controller()
    ctrl.add(p2)
    ctrl.cap()
    var abortable = Abortable()
    S(
        p,
        ctrl(),
        abortable,
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, ['test', 'test2'], 'should pipe the stuff')
        })
    )
    p.push('test')
    p2.push('test2')
    abortable.abort()
})

test('pass a function that returns a transform', function (t) {
    t.plan(4)
    var controller = Controller(function () {
        return S.map(function (n) {
            return n + 1
        })
    })
    controller.cap()

    S(
        S.values([1,2,3]),
        controller(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [2,3,4], 'should apply transforms')
        })
    )

    S(
        S.values([4,5,6]),
        controller(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [5,6,7], 'can be called multiple times')
        })
    )
})
