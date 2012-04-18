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
  
  $.ajax({
    url: "/github.json" 
  }).done(function (data) {
    var data = JSON.parse(data)
      , str
      , actions 
      , html = []
      ;

    for (i = 0; i < data.length; i++) {
      var message = data[i].message
        , info    = data[i].info
        ;

      str  = '<div class="github-wrap"><p class="github">' + message + '</p>'
      if (info) str += '<p>' + info + '</p></div>' 
      html.push(str)
    }
    actions = $(html.join(''))
    $('#github').append(actions)
  })

})
