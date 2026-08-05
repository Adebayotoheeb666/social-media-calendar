import { create } from 'zustand';

export const DAYS = [
  { id: 'mon', name: 'Monday', date: 'Aug 3' },
  { id: 'tue', name: 'Tuesday', date: 'Aug 4' },
  { id: 'wed', name: 'Wednesday', date: 'Aug 5' },
  { id: 'thu', name: 'Thursday', date: 'Aug 6' },
  { id: 'fri', name: 'Friday', date: 'Aug 7' },
  { id: 'ideas', name: 'Ideas Backlog', date: 'Unscheduled' },
];

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    columnId: 'mon',
    topic: 'Case Study',
    platforms: ['li', 'tw'],
    content: "🚀 How we helped a local bakery double online orders in 30 days using targeted IG ads.\n\n3 key takeaways below 👇\n1. High-intent local targeting\n2. Carousel format with product closeups\n3. Time-sensitive weekend discount code",
    time: '09:00 AM',
  },
  {
    id: 'post-2',
    columnId: 'tue',
    topic: 'Product Feature',
    platforms: ['ig'],
    content: "✨ Behind the scenes: A sneak peek into our new client portal dashboard!\n\nNo more digging through email threads. Everything lives in one clean view.",
    time: '02:30 PM',
  },
  {
    id: 'post-3',
    columnId: 'ideas',
    topic: 'Thought Leadership',
    platforms: ['li'],
    content: "Unpopular opinion: You don't need 10k followers to make $10k/month. You need 50 engaged clients who trust your offer.",
    time: 'Draft',
  },
  {
    id: 'post-4',
    columnId: 'thu',
    topic: 'Customer Review',
    platforms: ['tw', 'ig'],
    content: "“This tool saved our team 8 hours a week.” — Sarah M., Marketing Lead.\n\nNothing beats hearing direct feedback from users solving real problems daily!",
    time: '11:15 AM',
  },
  {
    id: 'post-5',
    columnId: 'ideas',
    topic: 'Weekly Tip',
    platforms: ['li', 'tw', 'ig'],
    content: "💡 Monday Productivity Hack: Batch your social content in one 2-hour session instead of context switching every morning.",
    time: 'Draft',
  },
];

export const useStore = create((set, get) => ({
  posts: INITIAL_POSTS,
  activePostId: null,
  previewPost: null,
  isAIPanelOpen: false,
  lastAction: null,

  setActivePostId: (id) => set({ activePostId: id }),
  setPreviewPost: (post) => set({ previewPost: post }),
  setAIPanelOpen: (open) => set({ isAIPanelOpen: open }),
  setLastAction: (message) => set({ lastAction: message }),

  movePost: (postId, targetColumnId) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, columnId: targetColumnId } : p
      ),
      lastAction: `Moved post to ${DAYS.find((d) => d.id === targetColumnId)?.name || targetColumnId}`,
    }));
  },

  addPost: (newPost) => {
    set((state) => ({
      posts: [
        {
          id: `post-${Date.now()}`,
          columnId: newPost.columnId || 'ideas',
          topic: newPost.topic || 'General',
          platforms: newPost.platforms || ['li'],
          content: newPost.content || '',
          time: newPost.time || '10:00 AM',
        },
        ...state.posts,
      ],
      lastAction: `Added a new draft for ${DAYS.find((d) => d.id === (newPost.columnId || 'ideas'))?.name || 'the backlog'}`,
    }));
  },

  updatePost: (id, updatedFields) => {
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
      lastAction: 'Updated post details',
    }));
  },

  deletePost: (id) => {
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      lastAction: 'Removed a post from the plan',
    }));
  },
}));
