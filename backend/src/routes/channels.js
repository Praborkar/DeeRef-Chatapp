const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');

// If you want to delete messages, Message model must exist:
let Message;
try {
  Message = require('../models/Message'); 
} catch (e) {
  Message = null; // fallback
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
| POST /channels - create a new channel
|--------------------------------------------------------------------------
*/
router.post('/', auth, async (req, res) => {
  try {
    console.log("----- CHANNEL CREATE DEBUG -----");
    console.log("Headers:", req.headers);
    console.log("Decoded user:", req.user);
    console.log("Request body:", req.body);

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Channel name required' });

    let exists = await Channel.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Channel with this name already exists' });

    const channel = new Channel({
      name,
      members: [req.user.userId]
    });

    await channel.save();

    const populated = await Channel.findById(channel._id)
      .populate('members', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    console.error("Channel Create Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| POST /channels/:id/join - join a channel
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

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| POST /channels/:id/leave - leave a channel
|--------------------------------------------------------------------------
*/
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const userId = req.user.userId;

    channel.members = channel.members.filter(
      m => m.toString() !== userId
    );
    await channel.save();

    const populated = await Channel.findById(channel._id)
      .populate('members', 'name email');

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /channels/:id - delete a channel
|--------------------------------------------------------------------------
*/
router.delete('/:id', auth, async (req, res) => {
  try {
    const channelId = req.params.id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Optional: delete all messages inside this channel
    if (Message) {
      await Message.deleteMany({ channelId });
    }

    // Delete channel itself
    await Channel.findByIdAndDelete(channelId);

    // Optional: send Socket.IO broadcast
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
