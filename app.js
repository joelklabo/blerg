var tako = require('tako')
  , request = require('request')
  , path = require('path')
  , fs = require('fs')
  , app = tako()
  , port = process.env.DEV_MODE == 'true' ? 8000 : 80
  ;

app.route('/static/*').files(path.join(__dirname, 'static'))

app.route('/')
  .html(function (req, res) {
    fs.createReadStream('./static/index.html').pipe(res)
  })
  .methods('GET')

//app.route('/hello.json').json({msg:'hello!'})

//app.route('/plaintext').text('I like text/plain')

app.httpServer.listen(port)

console.log('listening on port: ' + port);
