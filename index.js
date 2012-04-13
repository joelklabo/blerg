var tako = require('tako')
  , request = require('request')
  , path = require('path')
  , app = tako()
  ;

app.route('/static/*').files(path.join(__dirname, 'static'))

//app.route('/hello.json').json({msg:'hello!'})

//app.route('/plaintext').text('I like text/plain')

app.route('/')
  .html('<html><head><title>Hi</title></head><body>My name is Joel.</body></html>')
  .methods('GET')

app.httpServer.listen(80)
app.httpsServer.listen(443)

