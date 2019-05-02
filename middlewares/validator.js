'use strict'

const { checkSchema, validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const createError = require('http-errors')

module.exports = (schema) => {
  // Error formatter
  const errorFormatter = ({ location, msg, param }) => {
    return {
      location: location,
      param: param,
      msg: msg
    }
  }

  const result = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter)
    const data = matchedData(req)

    // Validation error
    if (!errors.isEmpty()) {
      return next(createError(400, 'Bad Request', { errors: errors.array({ onlyFirstError: true }) }))
    }

    // Expose data locally
    res.locals.data = data

    // Move to the next middleware
    next()
  }

  return [ checkSchema(schema), result ]
}
