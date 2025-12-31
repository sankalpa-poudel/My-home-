import React, { useState } from 'react';
import { FiX, FiTrash2, FiShield } from 'react-icons/fi';
import { chatAPI } from '../utils/api';
import useStore from '../store/useStore';

const GroupMembers = ({ chat, onClose, onMemberRemove }) => {
  const [loading, setLoading] = useState(false);
  const user = useStore((state) => state.user);
  const darkMode = useStore((state) => state.darkMode);

  const isAdmin = chat.groupAdmin?.some(admin => admin._id === user?.id) || 
                  chat.groupAdmin?.some(admin => admin === user?.id);

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the group?')) return;

    setLoading(true);
    try {
      await chatAPI.removeUserFromGroup(chat._id, memberId);
      onMemberRemove(memberId);
    } catch (error) {
      console.error('Error removing member:', error);
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
          <h2 className="text-xl font-bold">Group Members ({chat.users.length})</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <FiX size={20} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {chat.users.map(member => {
            const isCurrentUser = member._id === user?.id;
            const isGroupAdmin = chat.groupAdmin?.some(admin => 
              admin._id === member._id || admin === member._id
            );

            return (
              <div
                key={member._id}
                className={`p-4 border-b flex items-center justify-between ${
                  darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {member.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.username}
                      {isCurrentUser && ' (You)'}
                    </p>
                    {isGroupAdmin && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <FiShield size={12} /> Admin
                      </p>
                    )}
                  </div>
                </div>

                {isAdmin && !isCurrentUser && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-100 rounded disabled:opacity-50"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMembers;
