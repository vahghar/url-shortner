const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  urlCount: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);