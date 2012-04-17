$(document).ready(function () {
  $.ajax({
    url: "/tweets.json" 
  }).done(function (data) {
    var data = JSON.parse(data)
      , str
      , tweets
      , html = []
      ;

    for (i = 0; i < data.length; i++) {
      str = '<div class="tweet-wrap"><p class="tweet">' + data[i].text + '</p></div>';
      html.push(str)
    }
    tweets = $(html.join(''))
    $('#tweets').append(tweets)
  })
})
