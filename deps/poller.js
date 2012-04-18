var request = require('request')

function Poller (url, period, cb) {
  var int = setInterval(function () {
    request(url, function (error, response, data) {
      if (!error && response.statusCode == 200) {
        cb(data);
      }
    })
  }, period)
  return int
}

module.exports = function (url, period, cb) {
  return new Poller(url, period, cb)
}
