const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } }); // only createdAt

module.exports = mongoose.model('Message', MessageSchema);
