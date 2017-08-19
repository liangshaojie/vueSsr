const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new mongoose.Schema({
  name: String,
  token: String,
  expirse_in: Number,
  meat: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})


TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meat.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

TokenSchema.statics = {
  async getAccessToken() {
    const token = await this.findOne({
      name: 'access_token'
    }).exec()
    return token
  },
  async saveAccessToken() {
    let token = await this.findOne({
      name: 'access_token'
    }).exec()
    if (token) {
      token.token = data.access_token
      token.expirse_in = data.expirse_in
    } else {
      token = new Token({
        name: 'access_token',
        token: data.token,
        expirse_in: data.expirse_in
      })
    }
    await token.save()
    return data
  }
}

const Token = mongoose.model('Token', TokenSchema)







