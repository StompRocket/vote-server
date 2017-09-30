if (window.location.hostname == 'localhost') {
  var socket = io('localhost:8000')
} else {
  socket = io('https://infinite-reef-25554.herokuapp.com')
}

var app = new Vue({
  el: '#app',
  data: {
    canidates: [],
    voting: {}
  },
  mounted: function () {
    socket.emit('getVotes')
    socket.emit('getCanidates')
    socket.on('canidates', function (canidates) {
      console.log('got canidates', canidates)
      app.canidates = canidates
    })
    socket.on('votes', function (voting) {
      console.log(voting)
      app.voting = voting
    })
  },
  methods: {
    getVotes: function (canidate) {
      return this.voting[canidate].totalVotes
    },
    getVotesPercent: function (canidate) {
      var percent = this.getVotes(canidate) / this.voting.totalVotes * 100
      if (!percent) {
        return 0
      } else {
        return percent.toFixed(2)
      }
    }
  }
})
