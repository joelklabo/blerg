$(document).ready(function () {
  
  $.ajax({
    url: "/tweets.json" 
  }).done(function (data) {
    var data = JSON.parse(data)
      , left = '<div class="tweet-wrap">'
      , right = '</div>'
      , str
      , tweets
      , html = []
      ;

    for (i = 0; i < data.length; i++) {
      str = '<p>' + data[i].text + '</p>';
      html.push(left + str + right)
    }
    tweets = $(html.join(''))
    $('#tweets').append(tweets)
  })
  
  $.ajax({
    url: "/github.json" 
  }).done(function (data) {
    var data = JSON.parse(data)
      , left = '<div class="github-wrap">'
      , right = '</div>'
      , str
      , actions 
      , html = []
      ;

    for (i = 0; i < data.length; i++) {
      var message = data[i].message
        , info    = data[i].info
        ;

      str  = '<p>' + message + '</p>'
      if (info) str += '<p>' + info + '</p></div>' 
      html.push(left + str + right)
    }
    actions = $(html.join(''))
    $('#github').append(actions)
  })

})
