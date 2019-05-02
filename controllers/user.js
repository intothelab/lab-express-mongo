'use strict'

const bcrypt = require('bcrypt')
const cleanDeep = require('clean-deep')
const createError = require('http-errors')
const uuidv4 = require('uuid/v4')

// Models
const { User } = require('../models')

module.exports = {
  create: async (req, res, next) => {
    // Get validation results
    const data = res.locals.data

    // Password hash
    const hash = await bcrypt.hash(data.password, 12)

    // Define new user
    const user = new User(cleanDeep({
      name: data.name,
      username: data.username,
      password: hash,
      secret: uuidv4(),
      profile: {
        gender: data.gender,
        birthDate: data.birthDate,
        email: data.email,
        mobile: data.mobile
      },
      address: {
        postalCode: data.postalCode,
        number: data.number,
        street: data.street,
        complement: data.complement,
        district: data.district,
        locality: data.locality,
        state: data.state
      }
    }))

    const success = doc => {
      res.send({ message: 'User saved successfully' })
    }

    // Save new user
    user
      .save()
      .then(doc => success(doc))
      .catch(err => next(err))
  },

  find: async (req, res, next) => {
    const filter = {
      disabled: false }
    const projection = {
      _id: 0,
      __v: 0,
      disabled: 0,
      password: 0,
      secret: 0 }
    const sort = {
      name: 1 }
    const limit = 250

    const users = await User
      .find(filter, projection)
      .sort(sort)
      .limit(limit)
      .lean()
      .exec()

    res.send(users)
  },

  findOne: async (req, res, next) => {
    const filter = {
      disabled: false,
      username: req.params.username }
    const projection = {
      _id: 0,
      __v: 0,
      disabled: 0,
      password: 0,
      secret: 0
    }

    const user = await User
      .findOne(filter, projection)
      .lean()
      .exec()

    if (user) {
      res.send(user)
    } else {
      next(createError(404, 'Not found'))
    }
  },

  update: async (req, res, next) => {
    // Get validation results
    const data = res.locals.data

    // Update password
    let hash = ''
    let secret = ''

    if (data.password) {
      hash = await bcrypt.hash(data.password, 12)
      secret = uuidv4()
    }

    // Query params
    const filter = {
      disabled: false,
      username: req.params.username }
    const update = cleanDeep({
      name: data.name,
      username: data.username,
      password: hash,
      secret: secret,
      profile: {
        gender: data.gender,
        birthDate: data.birthDate,
        email: data.email,
        mobile: data.mobile
      },
      address: {
        postalCode: data.postalCode,
        number: data.number,
        street: data.street,
        complement: data.complement,
        district: data.district,
        locality: data.locality,
        state: data.state
      }
    })

    const success = result => {
      if (result.nModified) {
        res.send({ message: 'User updated successfully' })
      } else {
        next(createError(404, 'Not found'))
      }
    }

    User
      .updateOne(filter, update)
      .then(result => success(result))
      .catch(err => next(err))
  },

  delete: (req, res, next) => {
    const filter = {
      disabled: false,
      username: req.params.username }
    const update = {
      disabled: true
    }

    const success = result => {
      if (result.nModified) {
        res.send({ message: 'User deleted successfully' })
      } else {
        next(createError(404, 'Not found'))
      }
    }

    User
      .updateOne(filter, update)
      .then(result => success(result))
      .catch(err => next(err))
  }
}
