import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import useStore from '../store/useStore';

const GroupSettings = ({ chat, onClose, onUpdate }) => {
  const [groupName, setGroupName] = useState(chat.chatName || '');
  const [description, setDescription] = useState(chat.groupDescription || '');
  const [loading, setLoading] = useState(false);
  const darkMode = useStore((state) => state.darkMode);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdate({
        chatName: groupName,
        groupDescription: description
      });
    } catch (error) {
      console.error('Error updating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-lg w-full max-w-md ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Group Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg outline-none ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg outline-none resize-none ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
              rows="4"
            />
          </div>

          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg text-sm">
            ℹ️ Group members: {chat.users.length}
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
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSettings;
