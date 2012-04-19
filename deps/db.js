var request = require('request') 
  , config  = require('./config')
  , dbUrl   = config.db 
  , view    = '_design/all/_view/all?descending=true'
  ;

function add (datum) {

  var options = {}

  options.url    = dbUrl + datum.date
  options.method = 'PUT'
  options.json   = datum

  request(options, function (error, response, body) {
    console.log(body) 
  }) 

}

function getAll () {
  
  var options = {}

  options.url    = dbUrl + view
  options.method = 'GET'
  options.json   = true
  
  request(options, function (error, response, body) {
    console.log(body) 
  }) 

}

module.exports.add    = add
module.exports.getAll = getAll 
