var ToStream = require('pull-fn-stream')

// take api instance
// return transform stream
function ApiStream (api) {
    return ToStream.fromObject(api)
}

module.exports = ApiStream
