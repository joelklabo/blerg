var tako = require('tako')
  , request = require('request')
  , fs = require('fs')
  , app = tako()
  , config = require('./config')
  , port = process.env.DEV_MODE == 'true' ? 8000 : 80
  ;

app.route('/').html(function (req, res) {
  fs.createReadStream('./index.html').pipe(res)
})

app.route('/tweets.json').json(function (req, res) {
  request(config.tweetUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.end(body)
    }
  })
})

app.route('/github.json').json(function (req, res) {
  request(config.githubUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.end(body)
    }
  })
})

// serve files
app.route('/*').files(__dirname)

app.httpServer.listen(port)

console.log('listening on port: ' + port)
