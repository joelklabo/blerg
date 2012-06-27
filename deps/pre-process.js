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
  if (typeof data == 'string'){
    data = JSON.parse(data)
  }
  data.forEach(function (datum) {
    cb(datum)
  })
}

function GitHubPreProcessor () {
  PreProcessor.call(this)
  this.github = true 
  this.type = 'github'
}

function TwitterPreProcessor () {
  PreProcessor.call(this)
  this.twitter = true 
  this.type = 'twitter'
}


module.exports = {}

module.exports.GitHubPreProcessor  = GitHubPreProcessor
module.exports.TwitterPreProcessor = TwitterPreProcessor
