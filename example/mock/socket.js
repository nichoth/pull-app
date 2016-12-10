var S = require('pull-stream')
var Pushable = require('pull-pushable')

function random () {
    var min = 300;
    var max = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = function () {
    var p = Pushable()
    function emit (n) {
        setTimeout(function () {
            p.push(n)
            emit(random())
        }, n)
    }
    emit(random())
    return p
}

