import React, { useState, useRef } from 'react';
import { FiSend, FiSmile, FiPaperclip, FiMic } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import useStore from '../store/useStore';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const darkMode = useStore((state) => state.darkMode);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      onStopTyping();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    onTyping();
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload - would need backend implementation
      console.log('File selected:', file);
    }
  };

  return (
    <div className={`p-4 border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      {showEmojiPicker && (
        <div className="mb-4">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-xl hover:text-green-600"
        >
          <FiSmile size={20} />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xl hover:text-green-600"
        >
          <FiPaperclip size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />

        <input
          type="text"
          value={message}
          onChange={handleTyping}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className={`flex-1 outline-none ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'
          }`}
        />

        <button
          onClick={handleSendMessage}
          className="text-green-600 hover:text-green-700 font-bold"
        >
          {message.trim() ? <FiSend size={20} /> : <FiMic size={20} />}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
