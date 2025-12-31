const express = require('express');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get messages for a chat
router.get('/:chatId', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chat: req.params.chatId });

    res.json({
      messages: messages.reverse(),
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { chatId, text, fileUrl, fileType } = req.body;

    const message = new Message({
      sender: req.user.id,
      chat: chatId,
      text,
      fileUrl,
      fileType
    });

    await message.save();
    await message.populate('sender', 'username profilePicture');

    // Update chat's latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark messages as read
router.post('/:messageId/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const alreadyRead = message.readBy.some(r => r.user.toString() === req.user.id);
    if (!alreadyRead) {
      message.readBy.push({ user: req.user.id });
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Edit message
router.put('/:messageId', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.text = text;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete message
router.delete('/:messageId', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.deleted = true;
    await message.save();

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
