// utils/mockData.ts
import { Post } from '@/types';

export const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just finished an amazing workout! 💪 Feeling energized and ready for the day. What are your fitness goals?',
    author: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    createdAt: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    likes: 24,
    isLiked: false,
    comments: [
      {
        id: '201',
        content: 'Great job! What workout did you do?',
        author: {
          id: '102',
          name: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        },
        createdAt: '1 hour ago',
        likes: 3,
      },
    ],
  },
  {
    id: '2',
    content: 'Exploring the new coffee shop in town. The latte art here is incredible! ☕️',
    author: {
      id: '103',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    },
    createdAt: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    likes: 42,
    isLiked: true,
    comments: [
      {
        id: '202',
        content: 'That looks amazing! Where is this place?',
        author: {
          id: '104',
          name: 'Jessica Wong',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        },
        createdAt: '3 hours ago',
        likes: 2,
      },
      {
        id: '203',
        content: 'I was there yesterday too! The atmosphere is great.',
        author: {
          id: '105',
          name: 'David Kim',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        },
        createdAt: '2 hours ago',
        likes: 1,
      },
    ],
  },
];