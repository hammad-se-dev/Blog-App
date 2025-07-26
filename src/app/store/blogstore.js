import { create } from 'zustand';

const useBlogStore = create((set) => ({
  posts: [],
  addPost: (newPost) =>
    set((state) => ({
      posts: [newPost, ...state.posts],
    })),
}));
  
export default useBlogStore;
