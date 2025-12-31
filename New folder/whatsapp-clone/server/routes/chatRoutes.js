const express = require('express');
const Chat = require('../models/Chat');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all chats for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user.id })
      .populate('users', 'username profilePicture isOnline lastSeen')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or get one-to-one chat
router.post('/one-to-one', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;

    let chat = await Chat.findOne({
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: userId } } }
      ]
    }).populate('users', 'username profilePicture');

    if (!chat) {
      chat = new Chat({ users: [req.user.id, userId] });
      await chat.save();
      chat = await chat.populate('users', 'username profilePicture');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create group chat
router.post('/group', authMiddleware, async (req, res) => {
  try {
    const { chatName, users, description } = req.body;

    if (!chatName || !users || users.length < 2) {
      return res.status(400).json({ message: 'Chat name and at least 2 users required' });
    }

    if (!users.includes(req.user.id)) {
      users.push(req.user.id);
    }

    const chat = new Chat({
      chatName,
      isGroupChat: true,
      users,
      groupAdmin: [req.user.id],
      groupDescription: description
    });

    await chat.save();
    const populatedChat = await chat.populate('users', 'username profilePicture');

    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update group chat
router.put('/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatName, description, groupIcon } = req.body;

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.groupAdmin.includes(req.user.id)) {
      return res.status(403).json({ message: 'Only admins can update group' });
    }

    if (chatName) chat.chatName = chatName;
    if (description) chat.groupDescription = description;
    if (groupIcon) chat.groupIcon = groupIcon;

    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add user to group
router.post('/:chatId/add-user', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat.groupAdmin.includes(req.user.id)) {
      return res.status(403).json({ message: 'Only admins can add users' });
    }

    if (!chat.users.includes(userId)) {
      chat.users.push(userId);
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove user from group
router.post('/:chatId/remove-user', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat.groupAdmin.includes(req.user.id) && req.user.id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    chat.users = chat.users.filter(id => id.toString() !== userId);
    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
