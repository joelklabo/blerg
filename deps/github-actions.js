var moment = require('moment')

var actions = {
      CommitCommentEvent: 'committed to'
    , CreateEvent: 'created repo'
    , DeleteEvent: 'deleted'
    , DownloadEvent: 'downloaded'
    , FollowEvent: 'followed'
    , ForkEvent: 'forked'
    , ForkApplyEvent: 'applied fork to'
    , GistEvent: 'created a'
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

var buildCommitLink = function (repo, sha) {
  return 'https://github.com/' + repo + '/commit/' + sha
}

var getActorLink = function () {
  return 'https://github.com/joelklabo/' 
}

var buildInfo = function (datum) {

  var commits = datum.payload.commits
    , repo    = datum.repo.name
    , info    = []
    ;

  for (var i = 0; i < commits.length; i++) {
    var commit  = commits[i]
      , message = commit.message
      , sha     = commit.sha
      , o       = {}
      ;

    o.commit  = commit
    o.message = message
    o.sha     = sha
    o.commitLink = buildCommitLink(repo, sha)
   
    info.push(o)
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
  if        (type == "GistEvent") {
    o.itemLink = buildGistLink(data.payload.gist.id)
    o.repo = 'Gist'
  } else if (type == "PushEvent") {
    o.commits = buildInfo(data)
    o.itemLink = buildRepoLink(repo)
    o.repo = repo
  } else {
    o.itemLink = buildRepoLink(repo)
    o.repo = repo
  }
  o.date = moment(data.created_at).from(moment())
  o.github = true 
  o.type = 'github'

  return o
}
