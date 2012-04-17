var tako = require('tako')
  , fs = require('fs')
  , app = tako()
  , request = require('request')
  , port = process.env.DEV_MODE == 'true' ? 8000 : 80
  , tweetUrl = 'https://twitter.com/statuses/user_timeline/16474253.json'
  ;

app.route('/').html(function (req, res) {
  fs.createReadStream('./index.html').pipe(res)
})

app.route('/tweets.json').json(function (req, res) {
  request(tweetUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.end(body)
    }
  })
})

// serve files
app.route('/*').files(__dirname)

app.httpServer.listen(port)

console.log('listening on port: ' + port)
