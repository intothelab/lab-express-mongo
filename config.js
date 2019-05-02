'use strict'

require('dotenv').config()

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
  auth: {
    expires: process.env.AUTH_EXPIRES || '8h',
    secret: process.env.AUTH_SECRET || 'lab-express-mongo-secret'
  },
  database: {
    port: process.env.DB_PORT || '27017',
    uri: process.env.DB_URI || 'mongodb://localhost:27017/lab-express-mongo',
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    }
  },
  services: {
    sentry: process.env.SENTRY_DSN
  }
}
