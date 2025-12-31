import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI, authAPI } from '../utils/api';
import { initializeSocket, getSocket } from '../utils/socket';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import UserSelector from '../components/UserSelector';
import useStore from '../store/useStore';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [userSelectorMode, setUserSelectorMode] = useState('oneToOne');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get current user
        if (!user) {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        }

        // Initialize Socket.io
        const socket = initializeSocket();
        socket?.emit('join_user', { userId: user?.id });

        // Load chats
        await loadChats();
      } catch (error) {
        console.error('Error initializing app:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [user, navigate, setUser]);

  const loadChats = async () => {
    try {
      const response = await chatAPI.getAllChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const handleNewChat = (mode) => {
    setUserSelectorMode(mode);
    setShowUserSelector(true);
  };

  const handleChatCreated = (newChat) => {
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
    setShowUserSelector(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="hidden md:block md:w-1/3">
        <Sidebar
          onNewChat={handleNewChat}
          onSelectChat={setSelectedChat}
          chats={chats}
          currentChat={selectedChat}
        />
      </div>

      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-500">Select a chat or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {showUserSelector && (
        <UserSelector
          mode={userSelectorMode}
          onClose={() => setShowUserSelector(false)}
          onChatCreated={handleChatCreated}
        />
      )}
    </div>
  );
};

export default Chat;
