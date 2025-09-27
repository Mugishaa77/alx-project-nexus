// app/utils/mockData.ts
import { Post } from '../../types';

export const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just built an amazing social media app with React Native and Expo! 🚀 #coding #reactnative',
    author: {
      id: 'user1',
      name: 'Alex Johnson',
      username: 'alexdev',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    likes: 24,
    isLiked: false,
    comments: [
      {
        id: 'comment1',
        content: 'This looks awesome! Great work!',
        author: {
          id: 'user2',
          name: 'Sarah Chen',
          username: 'sarahcoder',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        createdAt: '2024-01-15T10:30:00Z'
      }
    ],
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    content: 'Beautiful sunset from my hike today! 🌅 Nature always inspires me to create better software.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    author: {
      id: 'user3',
      name: 'Maria Garcia',
      username: 'mariatrails',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    likes: 42,
    isLiked: true,
    comments: [],
    createdAt: '2024-01-14T18:45:00Z'
  },
  {
    id: '3',
    content: 'Just launched my new startup! After months of hard work, our social platform is live. So excited to share this journey with you all!',
    author: {
      id: 'user4',
      name: 'David Kim',
      username: 'davidstartup',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    likes: 156,
    isLiked: false,
    comments: [
      {
        id: 'comment2',
        content: 'Congratulations David! This is huge!',
        author: {
          id: 'user1',
          name: 'Alex Johnson',
          username: 'alexdev',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        createdAt: '2024-01-14T12:15:00Z'
      },
      {
        id: 'comment3',
        content: 'Amazing achievement! Wishing you all the success!',
        author: {
          id: 'user5',
          name: 'Lisa Wang',
          username: 'lisatech',
          avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150&h=150&fit=crop&crop=face'
        },
        createdAt: '2024-01-14T14:20:00Z'
      }
    ],
    createdAt: '2024-01-14T10:00:00Z'
  }
];

// Generate more posts for infinite scroll
export const generateMockPosts = (count: number): Post[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 4}`,
    content: `This is post number ${i + 4} with some interesting content about technology and development!`,
    author: {
      id: `user-${i + 6}`,
      name: `User ${i + 6}`,
      username: `user${i + 6}`,
      avatar: `https://i.pravatar.cc/150?img=${i + 10}`
    },
    likes: Math.floor(Math.random() * 100),
    isLiked: Math.random() > 0.5,
    comments: [],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }));
};

export default function MockData() {
  return null;
}