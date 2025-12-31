# Development Setup Guide

## Getting Started

### 1. Install Node.js
- Download from https://nodejs.org/ (LTS version recommended)
- Verify installation: `node --version` and `npm --version`

### 2. Install MongoDB

#### Option A: Local MongoDB
- Download from https://www.mongodb.com/try/download/community
- Install and ensure MongoDB service is running

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in server `.env`

### 3. Backend Setup

```bash
# Navigate to server directory
cd whatsapp-clone/server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
# Important: Change JWT_SECRET and ENCRYPTION_KEY to random values

# Start server
npm run dev
```

### 4. Frontend Setup

```bash
# In a new terminal, navigate to client directory
cd whatsapp-clone/client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start React app
npm start
```

### 5. First Time Usage

1. Open http://localhost:3000 in browser
2. Click "Sign up" and create account
3. Create another account (in incognito or different browser)
4. Start chatting!

## Development Workflow

### Adding New Features

1. **Backend Changes**:
   - Create model in `server/models/`
   - Create routes in `server/routes/`
   - Add API endpoints and Socket events
   - Restart server with `npm run dev`

2. **Frontend Changes**:
   - Create component in `client/src/components/`
   - Update state management in `client/src/store/`
   - Use API methods from `client/src/utils/api.js`
   - React auto-reloads on save

### Testing Locally

1. Use Postman/Insomnia for API testing:
   - POST http://localhost:5000/api/auth/login
   - GET http://localhost:5000/api/chats (with Auth token)

2. Open DevTools in browser:
   - Network tab: Monitor API calls
   - Console: Check for JavaScript errors
   - Application: View localStorage and cookies

## Useful Commands

```bash
# Backend
cd server
npm install              # Install dependencies
npm start               # Run server
npm run dev             # Run with auto-reload
npm test                # Run tests (if configured)

# Frontend
cd client
npm install              # Install dependencies
npm start               # Start React dev server
npm build               # Create production build
npm test                # Run tests
```

## Common Issues & Solutions

### Issue: Cannot connect to MongoDB
**Solution**:
- Check if MongoDB service is running
- Verify connection string in `.env`
- If using Atlas, ensure IP is whitelisted

### Issue: Socket.io not connecting
**Solution**:
- Ensure server is running on port 5000
- Check CORS configuration
- Clear browser cache and restart

### Issue: CORS errors
**Solution**:
- Verify `CLIENT_URL` in server `.env` matches frontend URL
- Check CORS middleware in `server/index.js`

### Issue: Module not found errors
**Solution**:
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables Explanation

**Server (.env)**:
- `PORT` - Server port (default 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for signing JWT tokens (use random string)
- `NODE_ENV` - Environment (development/production)
- `ENCRYPTION_KEY` - For future message encryption
- `CLIENT_URL` - Frontend URL for CORS

**Client (.env)**:
- `REACT_APP_API_URL` - Backend API base URL
- `REACT_APP_SOCKET_URL` - Socket.io server URL

## Performance Optimization

### Frontend
- Use React DevTools Profiler for performance
- Implement code splitting with React.lazy()
- Optimize images with compression
- Implement pagination for message loading

### Backend
- Add database indexes on frequently queried fields
- Implement caching with Redis
- Use pagination for API responses
- Add request rate limiting

## Next Steps

1. ✅ Test basic functionality
2. ✅ Try group chat features
3. ✅ Test dark mode toggle
4. ✅ Test responsive design on mobile
5. 📝 Implement file upload feature
6. 🔒 Add message encryption
7. 🚀 Deploy to production

## Support Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Socket.io Docs**: https://socket.io/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

Happy coding! 🚀
