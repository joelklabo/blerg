$(function () {
  $('.twitter').click(function () {
    var id = $(this).attr('data-tweet-id')
      , url = 'https://twitter.com/joelklabo/status/' + id; 
    window.location.replace(url) 
  })
  $('.see-commits').click(function (e) {
    var $list = $(this).parents().find('.commits').first();
    $list.toggle('slideDown')
  })
  $('.github').hover(function () {
    $(this).find('.see-commits').show()
  }, function () {
    $(this).find('.see-commits').hide()
  })
  $('.item a').click(function (e) {
    e.stopPropagation()
  })
  $('.header').hover(function (e) {
    $('.twitter-follow-button').fadeIn();
  }, function (e) {
    $('.twitter-follow-button').fadeOut();
  });

  Action = new Backbone.Model
  
  Actions = new Backbone.Collection

})
