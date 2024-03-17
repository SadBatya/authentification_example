const mongosee = require('mongoose')
const validator = require('validator')
let Schema = mongosee.Schema

let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email'
    }
  },
  password: {
    type: String,
    required: true,
  }
})

let User = mongosee.model('User', UserSchema)

module.exports = User
 