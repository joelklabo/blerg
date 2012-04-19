var tako       = require('tako')
  , fs         = require('fs')
  , request    = require('request')
  , db         = require('./deps/db')
  , poller     = require('./deps/poller')
  , config     = require('./deps/config')
  , transform  = require('./deps/transformers')
  , tranGh     = transform('github')
  , tranTw     = transform('twitter')
  , tenMinutes = 60 * 1000 * 10
  , port       = process.env.DEV_MODE == 'true' ? 8000 : 80
  , app        = tako()
  ;

// Instantiating GitHub Poller
poller(config.githubUrl, tenMinutes, function (data) {
  tranGh.trans(data).forEach(function (datum) {
    db.add(datum)
  })
})

// Instatiating Twitter Poller
poller(config.tweetUrl,  tenMinutes, function (data) {
  tranTw.trans(data).forEach(function (datum) {
    db.add(datum)
  })
})

// p.route('/').html(function (req, res) {
//   fs.createReadStream('./index.html').pipe(res)
// })
// 
// app.route('/tweets.json').json(function (req, res) {
//   request(config.tweetUrl, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       res.end(body)
//     }
//   })
// })
// 
// app.route('/github.json').json(function (req, res) {
//   request(config.githubUrl, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       res.end(ghParser(body))
//     }
//   })
// })
// 
// // serve files
// app.route('/*').files(__dirname)
// 
app.httpServer.listen(port)
// 
console.log('listening on port: ' + port)
