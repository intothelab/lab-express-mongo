'use strict'

module.exports = () => {
  return (err, req, res, next) => {
    let status = err.status || err.statusCode || 500
    let name = err.name || 'InternalServerError'
    let message = err.message || 'Something went wrong'
    let errors = err.errors

    if (res.headersSent) {
      return next(err)
    }

    // Mongoose unique
    if (err.code === 11000) {
      let match = err.message.match(/index: (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i)
      let param = match[1] || match[2]

      status = 409
      name = 'ConflictError'
      message = 'Conflict'
      errors = [
        {
          location: 'body',
          param: param,
          msg: 'Already exists'
        }
      ]
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      let error
      let errorsArray = []

      for (error in err.errors) {
        errorsArray.push({
          location: 'body',
          param: error,
          msg: 'Fill in correctly'
        })
      }

      status = 400
      name = 'BadRequestError'
      message = 'Bad Request'
      errors = errorsArray
    }

    // JWT error
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
      status = 401
      name = err.name || 'UnauthorizedError'
      message = err.message || 'You shall not pass'
    }

    // Internal Server Error
    if (status === 500 || name === 'InternalServerError' || message === 'Something went wrong') {
      status = 500
      name = 'InternalServerError'
      message = 'Something went wrong'
    }

    if (status >= 500 && status <= 599) {
      console.error(err.stack)
    }

    res.status(status).send({
      status: status,
      name: name,
      message: message,
      errors: errors
    })
  }
}
