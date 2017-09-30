if (window.location.hostname == 'localhost') {
  var socket = io('localhost:8000')
} else {
  socket = io('https://infinite-reef-25554.herokuapp.com')
}

 //

var app = new Vue({
  el: '#app',
  data: {
    loginMessage: 'Login',
    voted: false,
    modal: false,
    loginState: false,
    modalCandidate: {},
    canidates: []
  },
  mounted: function () {
    socket.on('votingClosed', function () {
      window.location.href = '/votingclosed.html'
    })
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var name = user.displayName
        var email = user.email
        var photoUrl = user.photoURL
        var emailVerified = user.emailVerified
        var uid = user.uid
        socket.emit('checkIfVoted', uid)
        socket.on('allreadyvoted', function () {
          window.location.href = '/voted.html'
        })
        socket.on('checksOut', function (canidates) {
          app.loginState = true
          socket.emit('getCanidates')
          socket.on('canidates', function (canidates) {
            console.log(app.canidates)
            console.log('got canidates', canidates)
            app.canidates = canidates
          })
        })
        app.loginMessage = 'Logout'
      } else {
        app.loginMessage = 'Login'
        app.loginState = false
      }
    })
  },
  methods: {
    login: function () {
      console.log('loging in')
      var user = firebase.auth().currentUser
      if (user) {
        firebase.auth().signOut().then(function () {
          app.loginMessage = 'Login'
          app.loginState = false
        }).catch(function (error) {
              // An error happened.
        })
      } else {
        firebase.auth().signInWithRedirect(provider)
      }
    },
    openModal: function (canidate) {
      this.modalCandidate = canidate
      this.modal = true
    },
    closeModal: function () {
      this.modal = false
    },
    voteFor: function (canidate) {
      var user = firebase.auth().currentUser
      var name, email, photoUrl, uid, emailVerified

      if (user != null) {
        name = user.displayName
        email = user.email
        photoUrl = user.photoURL
        emailVerified = user.emailVerified
        uid = user.uid  // The user's ID, unique to the Firebase project. Do NOT use
                       // this value to authenticate with your backend server, if
                       // you have one. Use User.getToken() instead.
      }
      console.log('voted for', canidate.name)
      socket.emit('vote', canidate.name, uid, email, name)
      this.modal = false
      this.voted = true
      var stateObj = {
        foo: 'bar'
      }
      history.pushState(stateObj, 'Voted ', 'voted.html')
    }
  }
})
