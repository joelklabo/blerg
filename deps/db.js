var request = require('request') 
  , config  = require('./config')
  , Hook    = require('hook.io').Hook
  , dbUrl   = config.db 
  , view    = '_design/all/_view/all?descending=true'
  ;

var hook = new Hook({
  name: 'db'
})

hook.start()

function add (datum) {
  
  var options = {}

  options.url    = dbUrl + datum.date
  options.method = 'PUT'
  options.json   = datum

  request(options, function (error, response, body) {
    if (body.error == 'conflict') { return }
    console.log('Inserting record', body) 
    hook.emit('log', {message: 'inserting record'})
    hook.emit('update')
  }) 

}

function getAll (cb) {
  
  var options = {}

  options.url    = dbUrl + view
  options.method = 'GET'
  options.json   = true
  
  request(options, function (error, response, body) {
    cb(body)
  }) 

}

module.exports.add    = add
module.exports.getAll = getAll 
