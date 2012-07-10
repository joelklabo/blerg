$(function () {
  $('.twitter').click(function () {
    var id = $(this).attr('data-tweet-id')
      , url = 'https://twitter.com/joelklabo/status/' + id; 
    window.location.replace(url) 
  })
  $('.github').hover(function () {
    var $list = $(this).find('ul');
    $list.fadeIn('slow');
  }, function () {
    var $list = $(this).find('ul');
    $list.fadeOut('slow');
  })
  $('.item a').click(function (e) {
    e.stopPropagation()
  })
})
