var forever = require('forever')
  , Hook    = require('hook.io').Hook
  ;
  
var hook = new Hook({
  name: 'forever'
})

hook.start()

var app = new (forever.Monitor)('app.js', {})
var server = new (forever.Monitor)('server.js', {})
var log = new (forever.Monitor)('logger.js', {})

app.on('exit', function(){
  hook.emit('log', {message: 'app exited'})
})

server.on('exit', function(){
  hook.emit('log', {message: 'server exited'})
})

app.start()
server.start()
log.start()
