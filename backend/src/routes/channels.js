const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');

let Message;
try {
  Message = require('../models/Message');
} catch (e) {
  Message = null;
}

/*
|--------------------------------------------------------------------------
| GET /channels - list all channels
|--------------------------------------------------------------------------
*/
router.get('/', auth, async (req, res) => {
  try {
    const channels = await Channel.find().populate('members', 'name email');
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| ⭐ GET /channels/:id - get single channel (REQUIRED for ChatHeader)
|--------------------------------------------------------------------------
*/
router.get('/:id', auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('members', 'name email');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (err) {
    console.error("Get Channel Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| POST /channels - Create Channel
|--------------------------------------------------------------------------
*/
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Channel name required' });

    let exists = await Channel.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Channel already exists' });

    const channel = new Channel({
      name,
      members: [req.user.userId],
    });

    await channel.save();

    const populated = await Channel.findById(channel._id)
      .populate('members', 'name email');

    if (req.io) {
      req.io.emit("channel:created", populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error("Channel Create Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| POST /channels/:id/join
|--------------------------------------------------------------------------
*/
router.post('/:id/join', auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const userId = req.user.userId;

    if (!channel.members.includes(userId)) {
      channel.members.push(userId);
      await channel.save();
    }

    const populated = await Channel.findById(channel._id)
      .populate('members', 'name email');

    if (req.io) {
      req.io.emit("channel:updated", populated);
    }

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| POST /channels/:id/leave
|--------------------------------------------------------------------------
*/
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const userId = req.user.userId;

    channel.members = channel.members.filter(
      (m) => m.toString() !== userId
    );

    await channel.save();

    const populated = await Channel.findById(channel._id)
      .populate('members', 'name email');

    if (req.io) {
      req.io.emit("channel:updated", populated);
    }

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /channels/:id
|--------------------------------------------------------------------------
*/
router.delete('/:id', auth, async (req, res) => {
  try {
    const channelId = req.params.id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (Message) {
      await Message.deleteMany({ channelId });
    }

    await Channel.findByIdAndDelete(channelId);

    if (req.io) {
      req.io.emit('channel:deleted', channelId);
    }

    res.json({
      message: 'Channel deleted successfully',
      id: channelId
    });

  } catch (err) {
    console.error("Delete Channel Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
