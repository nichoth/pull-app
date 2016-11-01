module.exports = function Api () {
    var api = {
        fetch: function (cb) {
            setTimeout(() => cb(null, { data: 'fetch' }), 300)
        },
        update: function (cb) {
            setTimeout(() => cb(null, { data: 'udpate' }), 500)
        },
        delete: function (cb) {
            setTimeout(() => cb(null, { data: 'delete' }), 750)
        }
    }
    return api
}
