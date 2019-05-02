'use strict'

const bodyParser = require('body-parser')
const config = require('./config')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const createError = require('http-errors')
const express = require('express')
const favicon = require('serve-favicon')
const helmet = require('helmet')
const logger = require('morgan')
const path = require('path')
const routes = require('./routes')
const { error } = require('./middlewares')
const { Sentry } = require('./services')

const app = express()

// Must be the first middleware on the app
if (config.services.sentry) {
  app.use(Sentry.Handlers.requestHandler())
}

app.use(helmet())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

if (config.logLevel === 'debug') {
  app.use(logger('dev'))
}

app.use('/', routes)

// Create NotFoundError and forwards to next middleware
app.use((req, res, next) => {
  next(createError(404, 'Not found'))
})

// Must come before the error middleware
if (config.services.sentry) {
  app.use(Sentry.Handlers.errorHandler())
}

// The error middleware must be the last one
app.use(error())

module.exports = app
