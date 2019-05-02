'use strict'

const config = require('../config')
const git = require('git-rev-sync')

if (config.services.sentry) {
  const Sentry = require('@sentry/node')

  Sentry.init({
    dsn: config.services.sentry,
    environment: config.environment,
    release: git.short()
  })

  module.exports = Sentry
}
