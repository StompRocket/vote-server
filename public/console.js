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
      // console.log('got canidates', canidates)
      app.canidates = canidates
    })
    socket.on('votes', function (voting) {
    //  console.log(voting)
      app.voting = voting
    })
  },
  computed: {
    sortedArray: function () {
      var sortable = []
      for (var vehicle in this.voting.canidates) {
        sortable.push([vehicle, this.voting.canidates[vehicle]])
      }
      function compare (a, b) {
        if (a[1].totalVotes > b[1].totalVotes) {
          return -1
        }
        if (a[1].totalVotes < b[1].totalVotes) {
          return 1
        }
        return 0
      }

      return sortable.sort(compare)
    }
  },
  methods: {

    getVotes: function (canidate) {
      // console.log(canidate, 'getVotes')
      return this.voting.canidates[canidate].totalVotes
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
