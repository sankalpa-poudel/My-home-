# WhatsApp Clone - Architecture & Technical Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                           │
│                       Port 3000                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  │  Auth Pages      │  │  Chat Pages      │  │  Components      │
│  │  - Login         │  │  - Chat          │  │  - Sidebar       │
│  │  - Signup        │  │  - Messages      │  │  - MessageList   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘
│
│  State Management: Zustand
│  HTTP Client: Axios
│  Real-time: Socket.io-client
│  Styling: Tailwind CSS
│  Routing: React Router v6
└─────────────────────────────────────────────────────────────────┘
                    ↓ HTTP/REST
              ↓ WebSocket (Socket.io)
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (Node.js/Express)                  │
│                       Port 5000                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  │  Routes          │  │  Middleware      │  │  Utils           │
│  │  - auth          │  │  - authMiddle    │  │  - encryption    │
│  │  - users         │  │  - errorHandle   │  │  - validation    │
│  │  - messages      │  │  - cors          │  │  - helpers       │
│  │  - chats         │  │  - logging       │  └──────────────────┘
│  └──────────────────┘  └──────────────────┘
│
│  Socket.io Events Handler
│  Real-time Communication
└─────────────────────────────────────────────────────────────────┘
                         ↓ MongoDB Driver
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                           │
├─────────────────────────────────────────────────────────────────┤
│  Collections:
│  - users        (user profiles, auth data)
│  - chats        (conversations)
│  - messages     (chat messages with metadata)
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### User Registration
```
User Input
    ↓
Form Validation (Client)
    ↓
API POST /auth/signup
    ↓
Input Validation (Server)
    ↓
Check Duplicate User
    ↓
Hash Password
    ↓
Create User in MongoDB
    ↓
Generate JWT Token
    ↓
Return Token & User Data
    ↓
Store Token in localStorage
    ↓
Redirect to /chat
```

### Message Sending
```
User Types Message
    ↓
Click Send Button
    ↓
Validate Message (not empty)
    ↓
API POST /messages
    ↓
Server Creates Message Document
    ↓
Socket.io emit 'send_message'
    ↓
Broadcast to Chat Participants
    ↓
Update MessageList Component
    ↓
Show Message in UI
```

### Real-time Chat Update
```
Message Received (Socket.io)
    ↓
Update Component State
    ↓
Auto-scroll to Latest Message
    ↓
Mark as Read (after delay)
    ↓
Socket.io emit 'read_messages'
    ↓
Update readBy Array in Database
    ↓
Sender Receives Read Receipt
```

---

## 🔐 Authentication Flow

### JWT Strategy
```
1. User Signup/Login
   └─> Generate JWT with user ID + expiry (7 days)
   └─> Store token in localStorage

2. Protected API Calls
   └─> Attach token in Authorization header
   └─> Server verifies token signature
   └─> Decode user ID from token
   └─> Proceed with request

3. Token Expiration
   └─> App detects expired token
   └─> Clear localStorage
   └─> Redirect to /login
   └─> User must login again
```

### Middleware Chain
```
Request
  ↓
[CORS Middleware] - Check origin
  ↓
[JSON Parser] - Parse request body
  ↓
[Auth Middleware] - Verify JWT (if protected route)
  ↓
[Route Handler] - Process request
  ↓
Response
```

---

## 🔌 Socket.io Events

### Client → Server
```
join_chat {chatId}
  └─> User joins chat room (receives messages from that chat)

send_message {data}
  └─> User sends a message (broadcasts to all in chat room)

typing {chatId, userId, username}
  └─> User is typing (broadcasts to others)

stop_typing {chatId, userId}
  └─> User stopped typing

read_messages {chatId, userId, messageIds}
  └─> User marked messages as read
```

### Server → Client
```
receive_message {messageData}
  └─> Broadcast when someone sends message to chat

user_typing {userId, username}
  └─> Show typing indicator

user_stop_typing {userId}
  └─> Hide typing indicator

messages_read {userId, messageIds}
  └─> Update read receipts
```

---

## 📊 State Management (Zustand)

```javascript
useStore = {
  // User State
  user: { id, username, email, profilePicture },
  setUser: (user),

  // Chat State
  chats: [{ _id, chatName, users, latestMessage }],
  setChats: (chats),
  currentChat: { _id, users, isGroupChat },
  setCurrentChat: (chat),

  // Message State
  messages: [{ _id, sender, text, createdAt, readBy }],
  setMessages: (messages),
  addMessage: (message),

  // UI State
  darkMode: boolean,
  toggleDarkMode: (),
  isLoading: boolean,
  setIsLoading: (loading),

  // Real-time State
  typingUsers: [{ userId, username }],
  addTypingUser: (user),
  removeTypingUser: (userId)
}
```

---

## 🎨 Component Lifecycle

### ChatWindow Component
```
Mount
  ↓
Load Messages from API
  ↓
Connect to Socket.io room
  ↓
Listen for: receive_message, user_typing, user_stop_typing
  ↓
[User Interaction]
  │
  ├─> Type & Send Message
  │   └─> Emit 'send_message'
  │   └─> Receive broadcast
  │   └─> Update state
  │
  ├─> Start Typing
  │   └─> Emit 'typing'
  │
  └─> Read Message
      └─> Emit 'read_messages'
  ↓
Unmount
  ↓
Cleanup listeners
  ↓
Leave Socket room
```

---

## 🗄️ Database Indexes

```javascript
// Users Collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ phone: 1 }, { sparse: true })

// Chats Collection
db.chats.createIndex({ users: 1 })
db.chats.createIndex({ createdAt: -1 })

// Messages Collection
db.messages.createIndex({ chat: 1, createdAt: -1 })
db.messages.createIndex({ sender: 1 })
db.messages.createIndex({ createdAt: -1 })
```

---

## 🚀 Deployment Architecture

```
Production Setup:

┌─────────────────────────────┐
│    Vercel/Netlify           │
│    (React Frontend)         │
│    Hosted React App         │
└────────────┬────────────────┘
             ↓
        API Calls
             ↓
┌─────────────────────────────┐
│    Heroku/Railway/AWS       │
│    (Node.js Backend)        │
│    Express Server           │
│    Socket.io WebSocket      │
└────────────┬────────────────┘
             ↓
       Database
             ↓
┌─────────────────────────────┐
│    MongoDB Atlas            │
│    Cloud Database           │
│    (Replicated & Backed up) │
└─────────────────────────────┘
```

---

## 🔧 Configuration Files

### Frontend (.env)
```
REACT_APP_API_URL=https://api.example.com/api
REACT_APP_SOCKET_URL=https://api.example.com
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/whatsapp-clone
JWT_SECRET=your-secret-key-min-32-chars
NODE_ENV=production
ENCRYPTION_KEY=your-32-char-encryption-key
CLIENT_URL=https://app.example.com
```

---

## 📈 Scalability Considerations

### Current Setup
- Single server instance
- MongoDB connection pooling (default: 100)
- In-memory Socket.io adapter
- File storage: Local file system

### Scaling to Production

#### Horizontal Scaling
```
Load Balancer
    ↓
├─→ Server Instance 1 ─┐
├─→ Server Instance 2  ├─→ MongoDB Cluster
├─→ Server Instance 3  │
└─→ Server Instance N ─┘

Redis Adapter for Socket.io to sync across instances
```

#### File Storage
- AWS S3 or Google Cloud Storage
- CDN for media delivery
- File expiration policy

#### Caching
- Redis for:
  - Session caching
  - User online status
  - Recent chats
  - Message cache

#### Database
- MongoDB Atlas Sharding
- Read replicas
- Automatic backups
- Point-in-time recovery

---

## 🔍 Monitoring & Logging

### Metrics to Monitor
- API response time
- Socket.io connection count
- Database query time
- Memory usage
- CPU usage
- Error rates

### Tools
- Winston (logging)
- Morgan (HTTP logging)
- Sentry (error tracking)
- New Relic (APM)
- Datadog (monitoring)

---

## 🧪 Testing Strategy

### Frontend Testing
- Unit tests: Jest + React Testing Library
- Integration tests: User flows
- E2E tests: Cypress or Playwright

### Backend Testing
- Unit tests: Jest/Mocha
- Integration tests: Supertest
- Load testing: Apache JMeter
- Socket.io testing: Socket.io client mock

---

## 🔒 Security Checklist

- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens (if needed)
- [ ] JWT secrets strong
- [ ] Password hashing secure
- [ ] Sensitive data not logged
- [ ] Environment variables not committed
- [ ] Dependencies regularly updated

---

## 📚 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI Framework |
| Styling | Tailwind CSS | Utility-first CSS |
| State | Zustand | State management |
| HTTP | Axios | API client |
| Real-time | Socket.io | WebSocket communication |
| Routing | React Router v6 | Client-side routing |
| Backend | Express.js | Web framework |
| Database | MongoDB | NoSQL database |
| ODM | Mongoose | MongoDB abstraction |
| Auth | JWT | Token authentication |
| Crypto | bcryptjs | Password hashing |
| Validation | express-validator | Input validation |
| CORS | cors | Cross-origin requests |
| Upload | Multer | File handling |

---

**For deployment guide, see [SETUP.md](SETUP.md)**
**For feature details, see [FEATURES.md](FEATURES.md)**
