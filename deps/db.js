var request = require('request') 
  , config  = require('./config')
  , dbUrl   = config.db 
  , options = {}
  ;

function add (datum) {
  options.url = dbUrl + datum.date
  options.method = 'PUT'
  options.json = datum
  request(options, function (error, response, body) {
    console.log(body) 
  }) 
}

module.exports.add = add
