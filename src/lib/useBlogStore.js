import { create } from 'zustand';

const useBlogStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user, // Set isLoggedIn to true if user exists, false otherwise
    }),
  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),
}));

export default useBlogStore;