const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema({
  board: { type: String, required: true },
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  created_on: { type: Date, default: new Date() },
  bumped_on: { type: Date, default: new Date() },
  reported: { type: Boolean, default: false },
  replies: [
    {
      text: { type: String, required: true },
      created_on: { type: Date, default: new Date() },
      delete_password: { type: String, required: true},
      reported: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('Thread', threadSchema);