 /*
  * All post-parsers will take the api response from
  * couchDB and format it into something useful. 
  *
  */

var ghParser = require('./github-actions')
  , moment   = require('moment')
  ;

function postProcessTweet (item) {
  var obj = {}
  obj.message = item.text
  obj.date    = moment(item.created_at).from(moment())
  obj.twitter = true 
  return obj
}

function postProcessGithub (item) {
  return ghParser(item)
}

function transform (data, cb) {
  if (typeof data == 'string'){
    data = JSON.parse(data)
  }
  data.forEach(function (datum) {
    cb(datum)
  })
}

function PostProcessor () {
  
  this.trans = function (data) {
    var res  = [] 
      , self = this
      , data = data.rows
      ;

    transform(data, function (datum) {
      var item = datum.value.data
        , type = datum.value.type
        ;

      switch (type) {
        case 'twitter':
          res.push(postProcessTweet(item))
          break;
        case 'github':
          res.push(postProcessGithub(item))
          break;
        default:
          console.log('Action item TypeError')
      }

    })
    return res 
  }

}

module.exports = {}

module.exports.PostProcessor = PostProcessor
