import React, { useState } from 'react';
import { FiPlus, FiSearch, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import useStore from '../store/useStore';

const Sidebar = ({ onNewChat, onSelectChat, chats, currentChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const user = useStore((state) => state.user);
  const darkMode = useStore((state) => state.darkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  const filteredChats = chats.filter((chat) => {
    const chatName = chat.chatName || chat.users.find(u => u._id !== user?.id)?.username || 'Unknown';
    return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className={`h-screen flex flex-col w-full max-w-sm border-r ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-600">Chats</h1>
          <div className="flex gap-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-full outline-none ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'
            }`}
          />
        </div>

        {/* Menu Dropdown */}
        {showMenu && (
          <div className={`absolute top-16 right-4 rounded-lg shadow-lg z-50 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => {
                onNewChat('group');
                setShowMenu(false);
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                darkMode ? 'hover:bg-gray-700' : ''
              }`}
            >
              New Group
            </button>
            <button
              onClick={handleLogout}
              className={`block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 ${
                darkMode ? 'hover:bg-gray-700' : ''
              }`}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <button
        onClick={() => onNewChat('oneToOne')}
        className="m-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
      >
        <FiPlus size={20} />
        New Chat
      </button>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No chats found
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherUser = chat.users.find(u => u._id !== user?.id);
            const displayName = chat.chatName || otherUser?.username || 'Unknown';
            const isActive = currentChat?._id === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`p-4 cursor-pointer border-b transition ${
                  isActive
                    ? darkMode ? 'bg-gray-800 border-green-600' : 'bg-gray-100 border-green-600'
                    : darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {displayName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{displayName}</h3>
                    <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {chat.latestMessage?.text || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
