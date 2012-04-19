/* 
 * All parsers will take the raw api response from
 * their respective endpoints and return an array of
 * objects that can be inserted into a database.
 * The object form will be:

 * {
 *    date: dateInMilliseconds
 *  , type: twitterOrGithub
 *  , data: theOriginalObject
 * }
 *
 */

function Transformer (type) {

  this.type = type
  
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
  var data = JSON.parse(data)
  data.forEach(function (datum) {
    cb(datum)
  })
}

module.exports = function (type) {
  return new Transformer(type)
}
