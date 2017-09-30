var express = require('express')
var app = express()
const port = process.env.PORT || 8000
var server = app.listen(port)
app.use(express.static('public'))
var socket = require('socket.io')
var io = socket(server)
var fs = require('fs')
console.log('listening on', port)
var canidates = []
var db = {}
var fs = require('fs')
fs.readFile(__dirname + '/config.json', function (err, data) {
  if (err) {
    throw err
  }
  data = JSON.parse(data.toString())
  canidates = data.canidates
  db = data
})
console.log(port)
// io.set('transports', ['xhr-polling'])
io.on('connection', function (socket) {
  console.log('connection')
  var type = 'client'
  io.emit('votes', db.voting)
  if (!db.voting.open) {
    socket.emit('votingClosed')
    console.log(db.voting.open, 'voting closed')
  }
  socket.on('getVotes', function () {
    type = 'console'
    socket.emit('votes', db.voting)
    console.log('sending votes')
  })
  socket.on('vote', function (canidate, uid, email, name) {
    console.log('checking', uid)
    db.voting.totalClients ++
    if (db.voting.users[uid]) {
      socket.emit('allreadyvoted')
    } else {
      console.log(canidate, uid, email, name)
      // console.log(db.voting)
      db.voting.canidates[canidate.toString()].votes.push(uid)
      db.voting.users[uid] = true
      db.voting.canidates[canidate.toString()].totalVotes ++
      db.voting.totalVotes ++
      io.emit('votes', db.voting)
    }
  })
  socket.on('checkIfVoted', function (uid) {
    console.log('checking', uid)
    if (db.voting.users[uid]) {
      socket.emit('allreadyvoted')
      console.log('allreadyvoted')
      // console.log(db)
    } else {
      socket.emit('checksOut')
      console.log('checksout')
    }
  })
  socket.on('getCanidates', function () {
    socket.emit('canidates', canidates)
  })
  socket.on('disconnect', function () {
    if (type == 'client') {
      db.voting.totalClients --
    }
    socket.emit('votes', db.voting)
    console.log('user disconnected')
  })
})
