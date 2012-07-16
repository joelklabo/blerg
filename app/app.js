var tako        = require('tako')
  , fs          = require('fs')
  , path        = require('path')
  , request     = require('request')
  , Hook        = require('hook.io').Hook
  , moment      = require('moment')
  , db          = require('../deps/db')
  , config      = require('../deps/config')
  , processor   = require('../deps/post-process')
  , postProcess = new processor.PostProcessor()
  , port        = process.env.DEV_MODE == 'true' ? 8000 : 80
  , fifteenMins = 60 * 1000 * 15
  , app         = tako()
  ;

app.actions = []

// Fill the actions array the first time
updateActions()

var hook = new Hook({
  name: 'app'
})

hook.on('db::update', function (data) {
  hook.emit('log', {message: 'updating actions'})
  updateActions()
})

hook.start()

function renderPosts (finish) {
  var page = app.page()
  page.template('action')
  page.promise('action')(false, {actions: app.actions})
  page.on('finish', finish)
  return page
}

function updateTimes () {
  hook.emit('log', {message: 'updating times'})
  app.actions.forEach(function (action) {
    action.date = moment(action.created_at).from(moment())
  })
}

function updateActions () {
  app.actions = []
  db.getAll(function (data) {
    postProcess.trans(data).forEach(function (datum){
      if (app.actions.length < 30) {
        app.actions.push(datum)
      }
    })
  })
}

setInterval(function () {
  updateTimes()
}, fifteenMins)

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
app.route('/*').files(path.resolve(__dirname, '../public/'))

app.httpServer.listen(port)

hook.emit('log', {message: 'server started on port ' + port})
