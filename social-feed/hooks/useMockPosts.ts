// hooks/useMockPosts.ts
import { useState, useEffect } from 'react';
import { Post } from '@/types';

export const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just finished an amazing workout! 💪 Feeling energized and ready for the day.',
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
    comments: [],
  },
];

export const useMockPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const refetch = () => {
    setLoading(true);
    setTimeout(() => {
      setPosts([...mockPosts]); // Fresh copy
      setLoading(false);
    }, 500);
  };

  return { posts, loading, refetch };
};