var tako      = require('tako')
  , fs        = require('fs')
  , request   = require('request')
  , db        = require('./deps/db')
  , poller    = require('./deps/poller')
  , config    = require('./deps/config')
  , transform = require('./deps/transformers')
  , tranGh    = transform('github')
  , tranTw    = transform('twitter')
  , tenMins   = 60 * 1000 * 10
  , port      = process.env.DEV_MODE == 'true' ? 8000 : 80
  , app       = tako()
  ;

// Instantiating GitHub Poller
poller(config.githubUrl, tenMins, function (data) {
  tranGh.trans(data).forEach(function (datum) {
    db.add(datum)
  })
})

// Instatiating Twitter Poller
poller(config.tweetUrl,  tenMins, function (data) {
  tranTw.trans(data).forEach(function (datum) {
    db.add(datum)
  })
})

app.route('/').html(function (req, res) {
  fs.createReadStream('./index.html').pipe(res)
})
 
app.route('/actions.json').json(function (req, res) {
  db.getAll(function (data) {
    res.end(data)
  })
})
 
// serve files
app.route('/*').files(__dirname)
 
app.httpServer.listen(port)

console.log('listening on port: ' + port)
