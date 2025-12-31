import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  darkMode: localStorage.getItem('darkMode') === 'true',
  typingUsers: [],

  setUser: (user) => set({ user }),
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.darkMode;
    localStorage.setItem('darkMode', newDarkMode);
    return { darkMode: newDarkMode };
  }),
  addTypingUser: (user) => set((state) => ({
    typingUsers: [...state.typingUsers, user]
  })),
  removeTypingUser: (userId) => set((state) => ({
    typingUsers: state.typingUsers.filter(u => u.userId !== userId)
  }))
}));

export default useStore;
