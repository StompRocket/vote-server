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
      app.updateChart()
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
    updateChart: function () {
      var ctx = document.getElementById('topThree').getContext('2d')
      var topThree = app.sortedArray.slice(0, 3)
      console.log(topThree)
      var topThreeChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [topThree[0][0], topThree[1][0], topThree[2][0]],
          datasets: [{
            label: '# of Votes',
            data: [topThree[0][1].totalVotes, topThree[1][1].totalVotes, topThree[2][1].totalVotes],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                suggestedMax: topThree[0][1].totalVotes + 20
              }
            }]
          }
        }
      })
    },
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
