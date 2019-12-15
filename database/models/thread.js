const mongoose = require('mongoose');
var message = require("./messages");
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


// Define userSchema
const threadSchema = new Schema({
    originalMessage: { type : ObjectId, ref: 'message' },
    color: Object,
    messages: [{ type : ObjectId, ref: 'message' }]
});

const Thread = mongoose.model('Thread', threadSchema);
module.exports = Thread;
