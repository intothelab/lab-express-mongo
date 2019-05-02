'use strict'

const express = require('express')
const helmet = require('helmet')
const router = express.Router()

// Middlewares
const { auth, validator, wrapper } = require('./middlewares')

// Validators
const validators = require('./validators')

// Controllers
const controllers = require('./controllers')

// CSP
router.use(helmet.contentSecurityPolicy({
  browserSniff: false,
  directives: { defaultSrc: ["'none'"] }
}))

// Login
router.post('/login', validator(validators.login.create), wrapper(controllers.login.create))
router.get('/login', auth(), wrapper(controllers.login.read))
router.delete('/login', auth(), wrapper(controllers.login.delete))

// Main
router.get('/', wrapper(controllers.main.index))

// User
router.post('/users', auth(), validator(validators.user.create), wrapper(controllers.user.create))
router.get('/users', auth(), wrapper(controllers.user.find))
router.get('/users/:username', auth(), wrapper(controllers.user.findOne))
router.put('/users/:username', auth(), validator(validators.user.update), wrapper(controllers.user.update))
router.delete('/users/:username', auth(), wrapper(controllers.user.delete))

module.exports = router
