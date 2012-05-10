var Hook = require('hook.io').Hook
  , fs   = require('fs')
  , config = require('../deps/config')
  , write  = fs.createWriteStream
  ;

var hook = new Hook({
  name: 'log'
}) 

hook.start()

hook.on('*::log', function(data){
  log(data.message) 
})

function log (message){
  var logFile = write(config.logFile, {flags: 'a'})
  message = new Date() + ': ' + message + '\n'
  logFile.end(message)
}
