var tako        = require('tako')
  , fs          = require('fs')
  , path        = require('path')
  , request     = require('request')
  , db          = require('./deps/db')
  , poller      = require('./deps/poller')
  , config      = require('./deps/config')
  , processor   = require('./deps/processors')
  , ghProcess   = new processor.GitHubPreProcessor()
  , twProcess   = new processor.TwitterPreProcessor()
  , postProcess = new processor.PostProcessor()
  , tenMins     = 60 * 1000 * 10
  , port        = process.env.DEV_MODE == 'true' ? 8000 : 80
  , app         = tako()
  ;

// Instantiating GitHub Poller
poller(config.githubUrl, tenMins, function (data) {
  ghProcess.trans(data).forEach(function (datum) {
    db.add(datum)
  })
})

// Instatiating Twitter Poller
poller(config.tweetUrl,  tenMins, function (data) {
  twProcess.trans(data).forEach(function (datum) {
    db.add(datum)
  })
})

app.templates.directory(path.resolve(__dirname, 'templates'))

app.route('/').html(function (req, res) {
  fs.createReadStream('./index.html').pipe(res)
})
 
app.route('/actions.json').json(function (req, res) {
  db.getAll(function (data) {
    res.end(postProcess.trans(data))
  })
})
 
// serve files
app.route('/*').files(__dirname)
 
app.httpServer.listen(port)

console.log('listening on port: ' + port)
