var tako        = require('tako')
  , fs          = require('fs')
  , path        = require('path')
  , request     = require('request')
  , Hook        = require('hook.io').Hook
  , db          = require('../deps/db')
  , config      = require('../deps/config')
  , processor   = require('../deps/processors')
  , postProcess = new processor.PostProcessor()
  , port        = process.env.DEV_MODE == 'true' ? 8000 : 80
  , app         = tako()
  ;

app.actions = []

// Fill the actions array the first time
updateActions()

var hook = new Hook({
  name: 'app'
})

hook.on('db::update', function(data){
  hook.emit('log', {message: 'updating actions'})
  updateActions()
})

hook.start()

function renderPosts(finish) {
  var page = app.page()
  page.template('action')
  page.promise('action')(false, {actions: app.actions})
  page.on('finish', finish)
  return page
}

function updateActions() {
  app.actions = []
  db.getAll(function (data) {
    postProcess.trans(data).forEach(function (datum){
      app.actions.push(datum)
    })
  })
}

app.templates.directory(path.resolve(__dirname, '../templates'))

app.route('/').html(function (req, res) {
  function finish(data) {
    db.getAll(function (data) {
      return postProcess.trans(data)
    })
  }
  req.pipe(renderPosts(finish)).pipe(res)
})
 
// serve files
app.route('/*').files(__dirname)
 
app.httpServer.listen(port)

console.log('listening on port: ' + port)
