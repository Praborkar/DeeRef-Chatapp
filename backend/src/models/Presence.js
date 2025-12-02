const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PresenceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  isOnline: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Presence', PresenceSchema);
