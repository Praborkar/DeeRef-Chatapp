const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Channel', ChannelSchema);
