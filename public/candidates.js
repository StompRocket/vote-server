if (window.location.hostname == 'localhost') {
  var socket = io('localhost:8000')
} else {
  socket = io('https://infinite-reef-25554.herokuapp.com')
}

var app = new Vue({
  el: '#app',
  data: {
    canidates: [],
    voting: {},
    image: ''
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

  },
  methods: {
    onFileChange (canidate, e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files[0], canidate)
    },
    createImage (file, canidate) {
      var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        canidate.image = e.target.result
        socket.emit('updateCanidates', app.canidates)
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (candidate) {
      candidate.image = ''
      socket.emit('updateCanidates', app.canidates)
    }
  }
})
