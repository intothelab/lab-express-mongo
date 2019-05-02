'use strict'

const address = {
  postalCode: {
    in: ['body'],
    optional: true,
    trim: true
  },
  number: {
    in: ['body'],
    optional: true,
    trim: true
  },
  street: {
    in: ['body'],
    optional: true,
    trim: true
  },
  complement: {
    in: ['body'],
    optional: true,
    trim: true
  },
  district: {
    in: ['body'],
    optional: true,
    trim: true
  },
  locality: {
    in: ['body'],
    optional: true,
    trim: true
  },
  state: {
    in: ['body'],
    optional: true,
    trim: true
  }
}

const profile = {
  gender: {
    in: ['body'],
    optional: true,
    trim: true
  },
  birthDate: {
    in: ['body'],
    optional: true,
    isISO8601: true,
    errorMessage: 'You must enter a valid date',
    trim: true
  },
  email: {
    in: ['body'],
    optional: true,
    isEmail: true,
    errorMessage: 'Please enter a valid email addresss',
    trim: true,
    normalizeEmail: true
  },
  mobile: {
    in: ['body'],
    optional: true,
    isNumeric: true,
    errorMessage: 'Enter only numbers',
    trim: true
  }
}

module.exports = {
  create: Object.assign({}, address, profile, {
    name: {
      in: ['body'],
      not: true,
      isEmpty: true,
      errorMessage: 'Please enter the user name',
      trim: true
    },
    username: {
      in: ['body'],
      isAlphanumeric: {
        errorMessage: 'Must contain only letters and / or numbers',
        options: 'pt-BR'
      },
      trim: true
    },
    password: {
      in: ['body'],
      isLength: {
        errorMessage: 'Password must be at least 8 characters',
        options: { 'min': 8 }
      },
      trim: true
    }
  }),

  update: Object.assign({}, address, profile, {
    name: {
      in: ['body'],
      optional: true,
      trim: true
    },
    username: {
      in: ['body'],
      optional: true,
      isAlphanumeric: {
        errorMessage: 'Must contain only letters and / or numbers',
        options: 'pt-BR'
      },
      trim: true
    },
    password: {
      in: ['body'],
      optional: true,
      isLength: {
        errorMessage: 'Password must be at least 8 characters',
        options: { 'min': 8 }
      },
      trim: true
    }
  })
}
