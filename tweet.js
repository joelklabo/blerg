var request = require('request');

request('https://twitter.com/statuses/user_timeline/16474253.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(JSON.parse(body)) // Print the google web page.
  }
})

