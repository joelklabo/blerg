/* 
 * All pre-parsers will take the raw api response from
 * their respective endpoints and return an array of
 * objects that can be inserted into a database.
 * The object form will be:
 *
 * {
 *    date: dateInMilliseconds
 *  , type: twitterOrGithub
 *  , data: theOriginalObject
 * }
 *
 * All post-parsers will take the api response from
 * couchDB and format it into something useful. 
 * This is something that should be done at the 
 * View level in couchDB but this is much simpler
 * right now. The post processed form should format
 * data into actions. Meaning a tweet at a certaing time
 * or an 'action' by a 'person' on a 'thing', with the
 * option of adding an 'info' parameter if necessary.
 * 
 *
 */

var ghParser = require('./gh-parser')
  , moment   = require('moment')
  ;

function PreProcessor () {

  this.trans = function (data) {
    var res  = [] 
      , self = this
      ;

    transform(data, function (datum) {
      var obj = {}
      obj.date = getMillis(datum.created_at)
      obj.type = self.type
      obj.data = datum
      res.push(obj)
    })
    return res 
  }

}

function getMillis (date) {
  var date = new Date(date)
  return date.getTime()
}

function transform (data, cb) {
  data.forEach(function (datum) {
    cb(datum)
  })
}

function GitHubPreProcessor () {
  PreProcessor.call(this)
  this.type = 'github'
}

function TwitterPreProcessor () {
  PreProcessor.call(this)
  this.type = 'twitter'
}

function postProcessTweet (item) {
  var obj = {}
  obj.message = item.text
  obj.date    = moment(item.created_at).from(moment())
  obj.type    = 'twitter'
  return obj
}

function postProcessGithub (item) {
  return ghParser(item)
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
          console.log('action type does not match')
      }

    })
    return res 
  }

}

module.exports = {}

module.exports.GitHubPreProcessor  = GitHubPreProcessor
module.exports.TwitterPreProcessor = TwitterPreProcessor
module.exports.PostProcessor       = PostProcessor
