var tako = require('tako')
  , fs = require('fs')
  , app = tako()
  , port = process.env.DEV_MODE == 'true' ? 8000 : 80
  ;

app.route('/').html(function (req, res) {
  fs.createReadStream('./index.html').pipe(res)
})

// serve files
app.route('/*').files(__dirname)

app.httpServer.listen(port)

console.log('listening on port: ' + port)
