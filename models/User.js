'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileSchema = new Schema({
  gender: String,
  birthDate: String,
  email: String,
  mobile: String
}, {
  _id: false
})

const addressSchema = new Schema({
  postalCode: String,
  number: String,
  street: String,
  complement: String,
  district: String,
  locality: String,
  state: String
}, {
  _id: false
})

const userSchema = new Schema({
  disabled: {
    type: Boolean,
    default: false,
    required: true
  },
  name: {
    type: String,
    required: true,
    index: 'text'
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  },
  roles: {
    type: Array,
    default: [ 'standard' ]
  },
  profile: profileSchema,
  address: addressSchema
}, {
  collation: {
    locale: 'pt',
    strength: 1,
    numericOrdering: true
  },
  collection: 'users',
  timestamps: true
})

userSchema.index({
  name: 1,
  username: 1,
  updatedAt: -1,
  createdAt: -1,
  disabled: 1
}, {
  collation: {
    locale: 'pt',
    strength: 1,
    numericOrdering: true
  }
})

module.exports = mongoose.model('User', userSchema)
