import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiCheck, FiCheckAll } from 'react-icons/fi';
import useStore from '../store/useStore';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);
  const darkMode = useStore((state) => state.darkMode);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            No messages yet. Start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {messages.map((message) => {
        const isOwn = message.sender._id === currentUser?.id;
        const isRead = message.readBy?.some(r => r.user !== currentUser?.id);

        return (
          <div
            key={message._id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwn
                  ? 'bg-green-600 text-white'
                  : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {!message.isGroupChat && !isOwn && (
                <p className="text-xs font-semibold mb-1">{message.sender.username}</p>
              )}

              {message.fileUrl && (
                <div className="mb-2">
                  {message.fileType === 'image' && (
                    <img src={message.fileUrl} alt="shared" className="max-w-full rounded" />
                  )}
                  {message.fileType === 'video' && (
                    <video controls className="max-w-full rounded">
                      <source src={message.fileUrl} />
                    </video>
                  )}
                  {['document', 'audio', 'voice-note'].includes(message.fileType) && (
                    <a
                      href={message.fileUrl}
                      download
                      className="text-blue-400 hover:underline"
                    >
                      📎 Download {message.fileType}
                    </a>
                  )}
                </div>
              )}

              {message.text && <p className="break-words">{message.text}</p>}

              {message.deleted && (
                <p className="italic opacity-75">This message was deleted</p>
              )}

              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-75">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: false })}
                </span>
                {isOwn && (
                  isRead ? <FiCheckAll size={14} /> : <FiCheck size={14} />
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
