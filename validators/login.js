'use strict'

module.exports = {
  create: {
    device: {
      in: ['body'],
      not: true,
      optional: true,
      trim: true
    },
    username: {
      in: ['body'],
      isAlphanumeric: {
        errorMessage: 'The username must only contain letters and / or numbers',
        options: 'pt-BR'
      },
      trim: true
    },
    password: {
      in: ['body'],
      not: true,
      isEmpty: true,
      errorMessage: 'You must enter a valid password',
      trim: true
    }
  }
}
