var forever = require('forever')
  , Hook    = require('hook.io').Hook
  ;
  
var hook = new Hook({
  name: 'forever'
})

hook.start()

var app = new (forever.Monitor)('./app/app.js', {})
var server = new (forever.Monitor)('./app/server.js', {})
var log = new (forever.Monitor)('./app/logger.js', {})

app.on('exit', function(){
  hook.emit('log', {message: 'app exited'})
})

server.on('exit', function(){
  hook.emit('log', {message: 'server exited'})
})

app.start()
server.start()
log.start()
