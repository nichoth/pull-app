var S = require('pull-stream')
var cat = require('pull-cat')
var request = require('../../request')
var select = require('obj-select').andCall

function ApiStream (api) {
    var reqs = Object.keys(api).reduce(function (acc, key) {
        acc[key] = request(api[key])
        return acc
    }, {})

    function findStream (ev) {
        var s = select(reqs, [].concat(ev))
        var reqStream = S(
            s,
            S.map(function (resp) {
                return [ev, resp]
            })
        )
        var stream = cat([
            S.once(['start', { op: ev }]),
            reqStream,
            S.once(['resolve', { op: ev }])
        ])
        return stream
    }
    return findStream
}

module.exports = ApiStream
