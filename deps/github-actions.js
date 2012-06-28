var moment = require('moment')

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
    , IssuesEvent: 'updated an issue on'
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

var buildRepoLink = function (repo) {
  return 'https://github.com/' + repo 
}

var buildGistLink = function (gist) {
  return 'https://gist.github.com/' + gist 
}

var getActorLink = function () {
  return 'https://github.com/joelklabo/' 
}

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

  var o       = {} 
    , actor   = data.actor.login
    , type    = data.type
    , repo    = data.repo.name
    ;


  o.actor = actor
  o.actorLink = getActorLink()
  o.action = actions[type]
  if (type == "GistEvent") {
    o.itemLink = buildGistLink(data.payload.gist.id)
    o.repo = '[gist]'
  } else {
    o.itemLink = buildRepoLink(repo)
    o.repo = repo
  }
  o.date = moment(data.created_at).from(moment())
  o.github = true 
  o.type = 'github'
  //if (type == "PushEvent") {
  //  obj.info = buildInfo(data)
  //}

  return o
}
