var tako = require('tako')
  , request = require('request')
  , path = require('path')
  , fs = require('fs')
  , app = tako()
  , port = process.env.DEV_MODE == 'true' ? 8000 : 80
  ;


// serve files
app.route('/*').files(__dirname)


app.httpServer.listen(port)

console.log('listening on port: ' + port)
