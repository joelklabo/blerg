var db          = require('../deps/db')
  , poller      = require('../deps/poller')
  , config      = require('../deps/config')
  , processor   = require('../deps/processors')
  , ghProcess   = new processor.GitHubPreProcessor()
  , twProcess   = new processor.TwitterPreProcessor()
  , postProcess = new processor.PostProcessor()
  , tenMins     = 60 * 1000 * 10
  ;

// Instantiating GitHub Poller
poller(config.githubUrl, tenMins, function (data) {
  console.log('polling for github actions...')
  ghProcess.trans(data).forEach(function (datum) {
    db.add(datum)
  })
})

// Instatiating Twitter Poller
poller(config.tweetUrl,  tenMins, function (data) {
  console.log('polling for tweets...')
  twProcess.trans(data).forEach(function (datum) {
    db.add(datum)
  })
})

console.log('server started')
