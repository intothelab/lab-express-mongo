'use strict'

const bcrypt = require('bcrypt')
const config = require('../config')
const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')

// Models
const { User } = require('../models')

;(async () => {
  mongoose.connect(config.database.uri, config.database.options)

  const mongo = mongoose.connection

  mongo.on('error', error => { console.log(error.stack); process.exit(1) })
  mongo.on('connected', () => { console.log('Mongo: Connected') })
  mongo.on('disconnected', () => { console.log('Mongo: Disconnected') })

  const count = await User
    .countDocuments({ disabled: false })
    .lean()
    .exec()

  if (!count) {
    new User({
      name: 'Lab Ventures',
      username: 'lab',
      password: await bcrypt.hash('intothelab', 12),
      secret: uuidv4(),
      roles: ['admin']
    })
      .save()
      .then(doc => {
        console.log('Script: Default user added')
        mongoose.connection.close()
        process.exit()
      })
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
  } else {
    console.log('Script: User already exists')

    mongoose.connection.close()
    process.exit()
  }
})().catch(err => {
  console.error(err)
  process.exit(1)
})
