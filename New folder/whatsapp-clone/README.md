# WhatsApp Clone - Full Stack Application

A modern, responsive WhatsApp clone built with React, Node.js, Express, Socket.io, and MongoDB. Features real-time messaging, group chats, dark mode, and a mobile-first responsive design.

## 📋 Features

### Frontend
- ✅ **Clean UI** - WhatsApp-style green and white theme
- ✅ **Authentication** - Secure login/signup with email and phone number
- ✅ **Real-time Chat** - Message bubbles with timestamps and read receipts
- ✅ **Group Chat** - Create and manage group chats with member management
- ✅ **Media Sharing** - Upload and share images, documents, and videos
- ✅ **Emoji Picker** - Add emojis to messages
- ✅ **Typing Indicator** - See when others are typing
- ✅ **Sidebar** - Recent chats, profile picture, and status updates
- ✅ **Responsive Design** - Mobile-first, fully responsive for all devices
- ✅ **Dark Mode** - Toggle between light and dark themes
- ✅ **Online Status** - See when users are online/offline

### Backend
- ✅ **Secure Authentication** - JWT-based auth with password hashing
- ✅ **Real-time Communication** - Socket.io for instant messaging
- ✅ **Message Management** - Create, read, edit, delete messages
- ✅ **Read Receipts** - Track message read status
- ✅ **User Management** - Profile updates, online status
- ✅ **Group Management** - Create, update, add/remove members
- ✅ **Scalable Architecture** - RESTful API with modular structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
ENCRYPTION_KEY=your_encryption_key_32_characters_long
```

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Start the React app:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
whatsapp-clone/
├── server/
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Message.js        # Message schema
│   │   └── Chat.js           # Chat/Conversation schema
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication endpoints
│   │   ├── userRoutes.js     # User management endpoints
│   │   ├── chatRoutes.js     # Chat management endpoints
│   │   └── messageRoutes.js  # Message endpoints
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── utils/
│   │   └── encryption.js     # Message encryption utilities
│   ├── index.js              # Server entry point
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.js           # Chat list sidebar
    │   │   ├── ChatWindow.js        # Main chat interface
    │   │   ├── MessageList.js       # Message display
    │   │   ├── MessageInput.js      # Message input with emoji picker
    │   │   └── UserSelector.js      # User/group selector modal
    │   ├── pages/
    │   │   ├── Login.js             # Login page
    │   │   ├── Signup.js            # Signup page
    │   │   └── Chat.js              # Main chat page
    │   ├── store/
    │   │   └── useStore.js          # Zustand state management
    │   ├── utils/
    │   │   ├── api.js               # API client configuration
    │   │   └── socket.js            # Socket.io client
    │   ├── styles/
    │   │   └── index.css            # Global styles
    │   ├── App.js                   # Main app component
    │   ├── index.js                 # React entry point
    │   └── index.css
    ├── public/
    │   └── index.html               # HTML template
    ├── package.json
    ├── tailwind.config.js           # Tailwind CSS config
    ├── postcss.config.js
    ├── .env.example
    └── tsconfig.json
```

## 🔐 Authentication Flow

1. **Signup**: User creates account with username, email, password, and optional phone
2. **Login**: User logs in with email and password
3. **JWT Token**: Token is issued and stored in localStorage
4. **Protected Routes**: All API calls include token in Authorization header

## 💬 Real-time Messaging

- **Socket.io Events**:
  - `join_chat` - User joins a chat room
  - `send_message` - Message sent to all chat participants
  - `typing` - User is typing indicator
  - `stop_typing` - User stopped typing
  - `read_messages` - Message read receipt

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `PUT /api/users/:id/status` - Update online status

### Chats
- `GET /api/chats` - Get all user chats
- `POST /api/chats/one-to-one` - Create one-to-one chat
- `POST /api/chats/group` - Create group chat
- `PUT /api/chats/:chatId` - Update group chat
- `POST /api/chats/:chatId/add-user` - Add member to group
- `POST /api/chats/:chatId/remove-user` - Remove member from group

### Messages
- `GET /api/messages/:chatId` - Get messages from chat
- `POST /api/messages` - Send message
- `POST /api/messages/:messageId/read` - Mark as read
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

## 🎨 UI/UX Features

- **WhatsApp Theme**: Green (#00d84a) and white color scheme
- **Dark Mode**: Toggle-able dark theme for all components
- **Responsive Grid**: 2-column layout on desktop, single column on mobile
- **Smooth Animations**: Transitions for theme switching and interactions
- **Avatar Generation**: Auto-generated colored avatars with initials
- **Timestamp Display**: Relative time format (e.g., "2 minutes ago")
- **Message Status**: Read receipts with double checkmarks

## 🔧 Configuration

### Environment Variables

**Server (.env)**:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
ENCRYPTION_KEY=32_character_encryption_key
CLIENT_URL=http://localhost:3000
```

**Client (.env)**:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📦 Dependencies

### Server
- express - Web framework
- socket.io - Real-time communication
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- dotenv - Environment variables
- multer - File uploads
- cors - Cross-origin requests

### Client
- react - UI framework
- react-router-dom - Routing
- socket.io-client - Real-time client
- axios - HTTP client
- emoji-picker-react - Emoji picker
- react-icons - Icon library
- tailwindcss - CSS framework
- zustand - State management
- date-fns - Date utilities

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Create account on Heroku or Railway
2. Connect your GitHub repository
3. Set environment variables in dashboard
4. Deploy!

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL`
4. Deploy!

## 🐛 Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check if ports 5000 and 3000 are available
- Verify CORS settings in server

### Socket.io Not Connecting
- Check server is running on correct port
- Verify `REACT_APP_SOCKET_URL` is correct
- Check browser console for errors

### Messages Not Loading
- Verify JWT token is valid
- Check MongoDB connection
- Inspect network requests in DevTools

## 🔒 Security Considerations

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for authentication
- ✅ CORS enabled for authorized origins
- ✅ Input validation on server
- ⏳ Message encryption (recommended for production)
- ⏳ Rate limiting on API endpoints
- ⏳ HTTPS in production

## 📝 Future Enhancements

- [ ] Message encryption (end-to-end)
- [ ] Voice/video calling
- [ ] Message reactions
- [ ] Message forwarding
- [ ] Message search
- [ ] User settings/preferences
- [ ] Push notifications
- [ ] Message pinning
- [ ] Message archiving
- [ ] Call history

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Happy coding! 🎉**
