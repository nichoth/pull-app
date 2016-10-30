module.exports = function Api () {
    var api = {
        fetch: function (cb) {
            setTimeout(() => cb(null, { data: 'fetch' }), 100)
        },
        update: function (cb) {
            setTimeout(() => cb(null, { data: 'udpate' }), 50)
        },
        delete: function (cb) {
            setTimeout(() => cb(null, { data: 'delete' }), 75)
        }
    }
    return api
}
