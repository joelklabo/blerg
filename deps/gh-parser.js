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
  ;

var buildInfo = function (datum) {

  var commits = datum.payload.commits
    , info    = []
    ;

  for (var i = 0; i < commits.length; i++) {
    var commit  = commits[i]
      , message = commit.message
      , sha     = commit.sha
      , obj     = {}
      ;

    obj.commit  = commit
    obj.message = message
    obj.sha     = sha
   
    info.push(obj)
  }

  return info

}

module.exports = function (data) {

  var obj     = {} 
    , actor   = data.actor.login
    , type    = data.type
    , repo    = data.repo.name
    ;


  obj.actor = actor
  obj.action = actions[type]
  obj.repo = repo
  obj.type = 'github'
  if (type == "PushEvent") {
    obj.info = buildInfo(data)
  }

  return obj
}
