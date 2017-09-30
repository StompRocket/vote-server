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
fs.writeFile(__dirname + '/public/port.txt', port, function (err) {
  if (err) {
    return console.log(err)
  }

  console.log('The file was saved!')
})
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
  socket.on('vote', function (canidate, uid, email, name) {
    console.log(canidate, uid, email, name)
    console.log(db.voting)
    db.voting[canidate.toString()].votes.push(uid)
    db.voting.users.uid = true
  })
  socket.on('checkIfVoted', function (uid) {
    console.log('checking', uid)
    if (db.voting.users.uid) {
      socket.emit('allreadyvoted')
      console.log('allreadyvoted')
    } else {
      socket.emit('checksOut')
      console.log('checksout')
    }
  })
  socket.on('getCanidates', function () {
    socket.emit('canidates', canidates)
  })
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})
