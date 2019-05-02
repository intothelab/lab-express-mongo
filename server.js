'use strict'

const app = require('./app')
const config = require('./config')
const http = require('http')

// Set port
const port = normalizePort(config.port)
app.set('port', port)

// Create HTTP server
const server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// Connect to the database
const mongoose = require('mongoose')
const { uri, options } = config.database
mongoose.connect(uri, options)

const mongo = mongoose.connection
mongo.on('error', error => { console.log(error.stack); process.exit(1) })
mongo.on('connected', () => { console.log('Mongo: Connected') })
mongo.on('disconnected', () => { console.log('Mongo: Disconnected') })

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  } else if (port >= 0) {
    return port
  }

  return false
}

function onError (error) {
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  if (error.code === 'EACCES') {
    // Log error
    console.error(bind + ' requires elevated privileges')

    // Ends the process
    process.exit(1)
  } else if (error.code === 'EADDRINUSE') {
    // Log error
    console.error(bind + ' is already in use')

    // Ends the process
    process.exit(1)
  } else {
    throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port

  console.log('Server: Listening on ' + bind)
}
