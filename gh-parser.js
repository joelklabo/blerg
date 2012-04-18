module.exports = function (data) {

  var res = [] 
    , data = JSON.parse(data)
    , len = data.length
    , actions = {
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
    ;

    for (i = 0; i < len; i++) {
      var item = []
        , datum = data[i]
        , actor = datum.actor.login
        , type  = datum.type
        , repo  = datum.repo.name
        ;

      // Build action string
      // Username
      item.push('<a href="https://github.com/' + actor + '">' + actor + '</a>')
      // Action
      item.push(actions[type])
      // Repo
      item.push('<a href="https://github.com/' + repo + '">' + repo + '</a>')

      // Join pieces and add to response
      res.push(item.join(' '))
    }

  return JSON.stringify(res)
}
