import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { chatAPI, messageAPI } from '../utils/api';
import { getSocket } from '../utils/socket';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import useStore from '../store/useStore';

const ChatWindow = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useStore((state) => state.user);
  const darkMode = useStore((state) => state.darkMode);
  const typingUsers = useStore((state) => state.typingUsers);
  const socket = getSocket();

  useEffect(() => {
    if (!chat?._id) return;

    loadMessages();
    socket?.emit('join_chat', chat._id);

    socket?.on('receive_message', handleReceiveMessage);
    socket?.on('user_typing', handleUserTyping);
    socket?.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket?.off('receive_message', handleReceiveMessage);
      socket?.off('user_typing', handleUserTyping);
      socket?.off('user_stop_typing', handleUserStopTyping);
    };
  }, [chat?._id, socket]);

  const loadMessages = async () => {
    if (!chat?._id) return;
    setLoading(true);
    try {
      const response = await messageAPI.getMessages(chat._id);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveMessage = (data) => {
    if (data.chatId === chat._id) {
      setMessages(prev => [...prev, data]);
    }
  };

  const handleUserTyping = (data) => {
    // Handle typing indicator
    console.log(`${data.username} is typing...`);
  };

  const handleUserStopTyping = () => {
    // Handle stop typing
  };

  const handleSendMessage = async (text) => {
    try {
      const messageData = {
        chatId: chat._id,
        text,
        sender: user
      };

      const response = await messageAPI.sendMessage({
        chatId: chat._id,
        text
      });

      socket?.emit('send_message', {
        ...response.data,
        chatId: chat._id
      });

      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    socket?.emit('typing', { chatId: chat._id, userId: user?.id, username: user?.username });
  };

  const handleStopTyping = () => {
    socket?.emit('stop_typing', { chatId: chat._id, userId: user?.id });
  };

  const otherUser = chat.users.find(u => u._id !== user?.id);
  const chatTitle = chat.chatName || otherUser?.username || 'Chat';

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden">
            <FiArrowLeft size={24} />
          </button>
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
            {chatTitle[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold">{chatTitle}</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {otherUser?.isOnline ? 'Online' : `Last seen at ${new Date(otherUser?.lastSeen).toLocaleTimeString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p>Loading messages...</p>
        </div>
      ) : (
        <MessageList messages={messages} currentUser={user} />
      )}

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className={`px-4 py-2 text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />
    </div>
  );
};

export default ChatWindow;
