'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authSchema = new Schema({
  disabled: {
    type: Boolean,
    default: false,
    required: true
  },
  id: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  collection: 'auth',
  timestamps: true
})

authSchema.index({
  updatedAt: -1,
  createdAt: -1,
  disabled: 1
})

module.exports = mongoose.model('Auth', authSchema)
