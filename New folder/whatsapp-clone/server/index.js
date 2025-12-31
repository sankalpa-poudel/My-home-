const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Socket.io Events
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.chatId).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user_typing', { userId: data.userId, username: data.username });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.chatId).emit('user_stop_typing', { userId: data.userId });
  });

  socket.on('read_messages', (data) => {
    io.to(data.chatId).emit('messages_read', { userId: data.userId, messageIds: data.messageIds });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
