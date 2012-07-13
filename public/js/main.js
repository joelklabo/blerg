$(function () {
  $('.twitter').click(function () {
    var id = $(this).attr('data-tweet-id')
      , url = 'https://twitter.com/joelklabo/status/' + id; 
    window.location.replace(url) 
  })
  $('.github').hover(function () {
    var $list = $(this).find('ul');
    $list.fadeIn();
  }, function () {
    var $list = $(this).find('ul');
    $list.fadeOut();
  })
  $('.item a').click(function (e) {
    e.stopPropagation()
  })
  $('.header').hover(function (e) {
    $('.twitter-follow-button').fadeIn();
  }, function (e) {
    $('.twitter-follow-button').fadeOut();
  });
})
