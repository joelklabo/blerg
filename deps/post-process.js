 /*
  * All post-parsers will take the api response from
  * couchDB and format it into something useful. 
  *
  */

var ghParser = require('./github-actions')
  , moment   = require('moment')
  ;

function postProcessTweet (item) {
  var obj = {}, text = item.text;
  obj.message = processTweetLinks(text)
  obj.created_at = item.created_at
  obj.date = moment(item.created_at).from(moment())
  obj.twitter = true 
  obj.id      = item.id_str
  return obj
}

function processTweetLinks (text) {
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
  text = text.replace(exp, "<a href='$1'>$1</a>");
  exp = /(^|\s)#(\w+)/g;
  text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
  exp = /(^|\s)@(\w+)/g;
  text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
  return text;
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
