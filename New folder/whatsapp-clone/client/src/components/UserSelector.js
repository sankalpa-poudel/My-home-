import React, { useState } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { userAPI, chatAPI } from '../utils/api';
import useStore from '../store/useStore';

const UserSelector = ({ onClose, onChatCreated, mode = 'oneToOne' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState('');
  const user = useStore((state) => state.user);
  const darkMode = useStore((state) => state.darkMode);

  React.useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length > 0) {
        setLoading(true);
        try {
          const response = await userAPI.getAllUsers();
          const filtered = response.data.filter(
            u => u._id !== user?.id && u.username.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setUsers(filtered);
        } catch (error) {
          console.error('Error searching users:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUsers([]);
      }
    };

    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, user?.id]);

  const handleSelectUser = (selectedUser) => {
    if (mode === 'oneToOne') {
      onSelectOneToOne(selectedUser);
    } else {
      setSelectedUsers(prev =>
        prev.find(u => u._id === selectedUser._id)
          ? prev.filter(u => u._id !== selectedUser._id)
          : [...prev, selectedUser]
      );
    }
  };

  const onSelectOneToOne = async (selectedUser) => {
    try {
      const response = await chatAPI.createOneToOneChat(selectedUser._id);
      onChatCreated(response.data);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!chatName.trim() || selectedUsers.length < 2) {
      alert('Please enter group name and select at least 2 users');
      return;
    }

    try {
      const response = await chatAPI.createGroupChat({
        chatName,
        users: selectedUsers.map(u => u._id)
      });
      onChatCreated(response.data);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-lg w-full max-w-md ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">
            {mode === 'oneToOne' ? 'Start a Chat' : 'Create Group'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
            />
          </div>

          {mode === 'group' && (
            <input
              type="text"
              placeholder="Group name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg outline-none ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
            />
          )}

          <div className="max-h-80 overflow-y-auto space-y-2">
            {loading ? (
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Searching...</p>
            ) : users.length === 0 && searchTerm ? (
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No users found</p>
            ) : (
              users.map(u => (
                <div
                  key={u._id}
                  onClick={() => handleSelectUser(u)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                    mode === 'group' && selectedUsers.find(su => su._id === u._id)
                      ? 'bg-green-600'
                      : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">
                    {u.username[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{u.username}</p>
                    <p className="text-xs opacity-75">{u.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t flex gap-2">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          {mode === 'group' && (
            <button
              onClick={handleCreateGroup}
              disabled={selectedUsers.length < 2 || !chatName.trim()}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Create Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSelector;
