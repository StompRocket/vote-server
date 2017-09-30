/* var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server) */
  var socketIO = require('socket.io')
  var express = require('express')
  const server = express()
  .use((req, res) => res.sendFile('/inde.html'))
  .listen(process.env.PORT || 8000, () => console.log('Listening on', process.env.PORT || 8000))
  const io = socketIO(server)
  var fs = require('fs')

  var canidates = []
  var db = {}
  fs.readFile(__dirname + '/config.json', function (err, data) {
    if (err) {
      throw err
    }
    data = JSON.parse(data.toString())
    canidates = data.canidates
    db = data
  })

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
