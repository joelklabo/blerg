var actions = {
      CommitCommentEvent: 'committed to'
    , CreateEvent: 'created repo'
    , DeleteEvent: 'deleted'
    , DownloadEvent: 'downloaded'
    , FollowEvent: 'followed'
    , ForkEvent: 'forked'
    , ForkApplyEvent: 'applied fork to'
    , GistEvent: 'created a gist'
    , GollumEvent: 'gollumed'
    , IssueCommentEvent: 'commented on'
    , IssuesEvent: 'updated and issue'
    , PullRequestEvent: 'submitted a pull request to'
    , PushEvent: 'pushed to'
    , WatchEvent: 'started watching'
  }
  , infoTypes = {
      CommitCommentEvent: false 
    , CreateEvent: false 
    , DeleteEvent: false 
    , DownloadEvent: false
    , FollowEvent: false 
    , ForkEvent: false 
    , ForkApplyEvent: false 
    , GistEvent: false 
    , GollumEvent: false
    , IssueCommentEvent: false
    , IssuesEvent: false 
    , PullRequestEvent: false 
    , PushEvent: true 
    , WatchEvent: false
  }
  , ghUrl = 'https://github.com/'
  ;

var buildInfo = function (datum) {

  var commits = datum.payload.commits
    , repo    = datum.repo.name
    , info    = []
    ;

  for (var i = 0; i < commits.length; i++) {
    var commit  = commits[i]
      , message = commit.message
      , sha     = commit.sha
      , str
      ;
   
    str = '<a href="' + ghUrl + repo + '/commit/' + sha + '">' + message + '</a>' 
    info.push(str)
  }

  return info.join(' ')
}
    
var typeHasInfo = function (type) {
  return infoTypes[type] ? true : false 
}

module.exports = function (data) {

  var res = [] 
    , data = JSON.parse(data)
    , len = data.length
    ;

    for (var i = 0; i < len; i++) {

      var item    = {} 
        , message = []
        , info    = [] 
        , datum   = data[i]
        , actor   = datum.actor.login
        , type    = datum.type
        , repo    = datum.repo.name
        , payload = datum.payload
        ;

      // Username
      message.push('<a href="' + ghUrl + actor + '">' + actor + '</a>')
      // Action
      message.push(actions[type])
      // Repo
      message.push('<a href="https://github.com/' + repo + '">' + repo + '</a>')

      // Join pieces and add to response
      item.message = message.join(' ')
      // Build info if it is available for this action type
      if (typeHasInfo(type)) item.info = buildInfo(datum) 
      // Add item to the response
      res.push(item)

    }

  return JSON.stringify(res)
}
