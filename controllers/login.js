'use strict'

const bcrypt = require('bcrypt')
const config = require('../config')
const cleanDeep = require('clean-deep')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const uuidv4 = require('uuid/v4')

// Models
const { Auth, User } = require('../models')

module.exports = {
  create: async (req, res, next) => {
    // Get validation results
    const data = res.locals.data

    const filter = {
      disabled: false,
      username: data.username
    }

    const user = await User
      .findOne(filter)
      .lean()
      .exec()

    if (user) {
      const match = await bcrypt.compare(data.password, user.password)

      if (match) {
        const payload = {
          username: user.username,
          name: user.name }
        const options = {
          expiresIn: config.auth.expires
        }

        jwt.sign(payload, user.secret, options, function (err, signedToken) {
          if (err) { return next(err) }

          const auth = new Auth(cleanDeep({
            id: uuidv4(),
            username: user.username,
            token: signedToken,
            metadata: {
              useragent: req.headers['user-agent'],
              hostname: req.hostname,
              ip: req.ip,
              ips: req.ips }
          }))

          const success = doc => {
            res.send({ token: signedToken })
          }

          auth
            .save()
            .then(doc => success(doc))
            .catch(err => next(err))
        })
      } else {
        setTimeout(() => { next(createError(404, 'Wrong username or password')) }, 3000)
      }
    } else {
      setTimeout(() => { next(createError(404, 'Wrong username or password')) }, 3000)
    }
  },

  read: (req, res, next) => {
    res.send(res.locals.auth)
  },

  delete: (req, res, next) => {
    res.send({ message: 'Logout' })
  }
}
