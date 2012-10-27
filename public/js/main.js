$(function () {

  Actions = Backbone.Collection.extend({
    events: {
      'reset': 'reset'
    }
    , reset: function () {
      item = new ActionItem({ model: actions.first()})
      item.render()
    }
  })

  ActionItem = Backbone.View.extend({
    template: _.template(
      '<li class="item"><h3>test</h3></li>'
    )
    , render: function () {
      $('.action-list').append(this.template())
    }
  })
  
  actions = new Actions

})
