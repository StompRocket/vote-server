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

  db = data
})
console.log(port)
// io.set('transports', ['xhr-polling'])
io.on('connection', function (socket) {
  console.log('connection')
  if (!db.voting.open) {
    socket.emit('votingClosed')
    console.log(db.voting.open, 'voting closed')
  }
  socket.on('updateCanidates', (canidates) => {
    db.canidates = canidates
    var saveDB = JSON.stringify(db)
    fs.writeFile(__dirname + '/config.json', saveDB, function (err) {
      if (err) {
        return console.log(err)
      }

      console.log('DB saved')
    })
  })
  socket.on('getVotes', function () {
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
      var saveDB = JSON.stringify(db)
    //  console.log(saveDB)
      fs.writeFile(__dirname + '/config.json', saveDB, function (err) {
        if (err) {
          return console.log(err)
        }

        console.log('DB saved')
      })
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
    socket.emit('canidates', db.canidates)
  })
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})
