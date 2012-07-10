$(function () {
  $('.twitter').click(function () {
    var id = $(this).attr('data-tweet-id')
      , url = 'https://twitter.com/joelklabo/status/' + id; 
    window.location.replace(url) 
  })
  $('.item a').click(function (e) {
    e.stopPropagation()
  })
})
