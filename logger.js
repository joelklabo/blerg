var Hook = require('hook.io').Hook
  , fs   = require('fs')
  , config = require('./deps/config')
  ;

var hook = new Hook({
  name: 'log'
}) 

hook.start()

hook.on('*::log', function(data){
  log(data.message) 
})

function log (message){
  message = new Date() + ': ' + message
  console.log(message)
}
