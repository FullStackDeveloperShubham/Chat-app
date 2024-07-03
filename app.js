const express = require('express')

const path = require('path')

const app = express()

const PORT = process.env.PORT || 4000


// public folder as static
app.use(express.static(path.join(__dirname, 'public')))




const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})







////////////////////////////////////////////////////////////////////////
const io = require('socket.io')(server)

let socketConnected = new Set()

// socket io

io.on('connection', onConneted)

function onConneted(socket) {
  console.log(socket.id)
  socketConnected.add(socket)

  io.emit('clients-total', socketConnected.size)


  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id)
    socketConnected.delete(socket.id)

    io.emit('clients-total', socketConnected.size)
  })

  socket.on('message', (data) => {
    console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}



