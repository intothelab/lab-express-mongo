'use strict'

const createError = require('http-errors')
const jwt = require('jsonwebtoken')

// Models
const { User } = require('../models')

module.exports = () => {
  return async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer/, '').trim()
    const regex = /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/
    const isJWT = regex.test(token)

    if (isJWT) {
      const { username } = jwt.decode(token) || {}

      if (username) {
        const user = await User
          .findOne({
            disabled: false,
            username: username })
          .lean()
          .exec()

        if (user) {
          jwt.verify(token, user.secret, function (err, decoded) {
            if (err) { return next(err) }

            // Expose token payload locally
            res.locals.auth = decoded

            // Move to the next middleware
            next()
          })
        } else {
          next(createError(401, 'You shall not pass'))
        }
      } else {
        next(createError(401, 'You shall not pass'))
      }
    } else {
      next(createError(401, 'You shall not pass'))
    }
  }
}
