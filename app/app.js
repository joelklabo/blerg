var tako        = require('tako')
  , _           = require('underscore')
  , fs          = require('fs')
  , db          = require('../deps/db')
  , app         = tako()
  , port        = 8000//process.env.DEV_MODE == 'true' ? 8000 : 80
  , path        = require('path')
  , Hook        = require('hook.io').Hook
  , hogan       = require('hogan.js')
  , config      = require('../deps/config')
  , moment      = require('moment')
  , request     = require('request')
  , processor   = require('../deps/post-process')
  , postProcess = new processor.PostProcessor()
  , fifteenMins = 60 * 1000 * 15
  ;

// Fill the actions array the first time
updateActions()

// Compile the templates and cache them
compileTemplates()

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

function compileTemplates () {
  var templatesDir = path.resolve(__dirname, '../templates')
  app.templates = {}
  fs.readdir(templatesDir, function (err, files) {
    if (err) throw err
    if (files) {
      files.forEach(function (file) {
        fs.readFile(path.resolve(templatesDir, file), 'utf8', function (err, data) {
          if (err) throw err
          app.templates[file] = hogan.compile(data)
        })
      }) 
    }
  })
}

function updateTimes () {
  hook.emit('log', {message: 'updating times'})
  app.actions.forEach(function (action) {
    action.date = moment(action.created_at).from(moment())
  })
}

var hook = new Hook({
  name: 'app'
})

hook.on('db::update', function (data) {
  hook.emit('log', {message: 'updating actions'})
  updateActions()
})

hook.start()

setInterval(function () {
  updateTimes()
}, fifteenMins)

app.route('/').html(function (req, res) {
  res.end(app.templates['index'].render({ actions: JSON.stringify(app.actions) }))
})
 
// serve files
app.route('/*').files(path.resolve(__dirname, '../public/'))

app.httpServer.listen(port)

hook.emit('log', {message: 'server started on port ' + port})
