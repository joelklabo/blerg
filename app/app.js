var _           = require('underscore')
  , fs          = require('fs')
  , db          = require('../deps/db')
  , port        = 8000//process.env.DEV_MODE == 'true' ? 8000 : 80
  , path        = require('path')
  , http        = require('http')
  , Hook        = require('hook.io').Hook
  , hogan       = require('hogan.js')
  , router      = require('router')
  , route       = router() 
  , moment      = require('moment')
  , processor   = require('../deps/post-process')
  , postProcess = new processor.PostProcessor()
  , fifteenMins = 60 * 1000 * 15
  , app         = {}
  ;

// Fill the actions array the first time
updateActions()

// Compile the templates and cache them
compileTemplates()

function updateActions () {
  app.actions = []
  db.getAll(function (data) {
    postProcess.trans(data).forEach(function (datum){
      app.actions.push(datum)
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

function serveFile (file, req, res) {
  var mimeTypes = {
      "html": "text/html"
    , "jpeg": "image/jpeg"
    , "jpg" : "image/jpeg"
    , "gif" : "image/gif"
    , "png" : "image/png"
    , "js"  : "text/javascript"
    , "css" : "text/css"
  }
  fs.exists(file, function (exists) {
    if (!exists) {
      console.log("This file does not exist: " + file);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('404 Not Found\n');
      res.end();
    }
    var mimeType = mimeTypes[path.extname(file).split(".")[1]];
    res.writeHead(200, {'Content-Type': mimeType});
    var fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
  });
}

function updateTimes () {
  hook.emit('log', {message: 'updating times'})
  app.actions.forEach(function (action) {
    action.date = moment(action.created_at).from(moment())
  })
}

var hook = new Hook({
  name: 'Main'
})

hook.on('db::update', function (data) {
  hook.emit('log', {message: 'updating actions'})
  updateActions()
})

hook.start()

setInterval(function () {
  updateTimes()
}, fifteenMins)

route.get('/', function (req, res) {
  res.end(app.templates['index'].render({ actions: JSON.stringify(app.actions) }))
})

route.get('/{slug}/', function (req, res) {
  res.end(app.templates[req.params.slug].render())
})

// serve files
route.get('/*', function (req, res) { 
  var file = path.resolve(__dirname, '../public/', req.params.wildcard)
  serveFile(file, req, res)
})
http.createServer(route).listen(port)

hook.emit('log', {message: 'server started on port ' + port})
