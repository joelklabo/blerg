$(document).ready(function () {
  
  $.ajax({
    url: "/actions.json" 
  }).done(function (data) {
    var left = '<div class="github-wrap">'
      , right = '</div>'
      , str
      , actions 
      , html = []
      ;

    for (i = 0; i < data.length; i++) {
      html.push(left + data[i].type + right)
    }
    actions = $(html.join(''))
    $('#github').append(actions)
  })

})
