const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');

const PAGE_SIZE = 20;

// GET /messages/:channelId?page=1
router.get('/:channelId', auth, async (req, res) => {
  try {
    const { channelId } = req.params;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const skip = (page - 1) * PAGE_SIZE;

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    // Only allow messages for channels user is a member of (optional)
    // if (!channel.members.map(m => m.toString()).includes(req.user.userId)) {
    //   return res.status(403).json({ message: 'Not a member of this channel' });
    // }

    const total = await Message.countDocuments({ channelId });
    const messages = await Message.find({ channelId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .populate('userId', 'name email');

    res.json({
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
      totalMessages: total,
      messages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
