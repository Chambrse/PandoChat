const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define userSchema
const messageSchema = new Schema({
  text: String,
  username: String,
  id: Number,
  replyTo: Number
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
