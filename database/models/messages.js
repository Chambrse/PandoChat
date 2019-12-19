const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

// Define userSchema
const messageSchema = new Schema({
  text: String,
  username: String,
  user: { type: ObjectId, ref: 'User'},
  color: Object,
  id: Number,
  replyTo: { type : ObjectId, ref: 'Message' },
  thread: { type : ObjectId, ref: 'Thread' }
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
