#!/bin/bash
# WhatsApp Clone Quick Start Script

echo "🚀 WhatsApp Clone - Setup Script"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"

# Navigate to root directory
cd "$(dirname "$0")"

# Setup Server
echo ""
echo "📦 Setting up Backend Server..."
cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update server/.env with your MongoDB URI and secrets"
fi

cd ..

# Setup Client
echo ""
echo "📦 Setting up Frontend Client..."
cd client

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Frontend .env created with default values"
fi

cd ..

# Summary
echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Update MongoDB URI in server/.env"
echo "2. Start MongoDB (local or ensure Atlas connection works)"
echo "3. Open two terminals:"
echo ""
echo "Terminal 1 - Start Backend Server:"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 - Start Frontend Client:"
echo "  cd client && npm start"
echo ""
echo "🌐 Frontend will open at http://localhost:3000"
echo "🔌 Backend API at http://localhost:5000"
echo ""
echo "📚 Documentation:"
echo "  - Setup Guide: SETUP.md"
echo "  - Features: FEATURES.md"
echo "  - Architecture: ARCHITECTURE.md"
echo "  - README: README.md"
echo ""
echo "Happy coding! 🎉"
