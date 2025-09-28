// app/services/api.ts
import { Post, Comment, LikeResponse, CommentResponse, ShareResponse } from '../../types';

const API_BASE_URL = 'https://dummyjson.com';

export const getPosts = async (page: number = 1, limit: number = 10): Promise<Post[]> => {
  try {
    const skip = (page - 1) * limit;
    const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // dummyjson returns posts array directly, not nested in data.posts
    const posts = data.posts || data || [];
    
    console.log('Fetched posts:', posts.length); // Debug log

    // Transform API data to match our Post type
    const transformedPosts = await Promise.all(
      posts.map(async (post: any, index: number) => {
        try {
          // For dummyjson, we need to fetch user details separately
          const userResponse = await fetch(`${API_BASE_URL}/users/${post.userId || (index + 1)}`);
          const user = await userResponse.json();

          // Fetch comments for this post
          const commentsResponse = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`);
          const commentsData = await commentsResponse.json();

          return {
            id: post.id.toString(),
            content: post.body || post.content,
            author: {
              id: user.id?.toString() || (index + 1).toString(),
              name: `${user.firstName || 'User'} ${user.lastName || (index + 1)}`,
              username: user.username || `user${index + 1}`,
              avatar: user.image || `https://i.pravatar.cc/150?img=${user.id || index + 1}`
            },
            likes: post.reactions ? Object.values(post.reactions).reduce((a: number, b: number) => a + b, 0) : Math.floor(Math.random() * 100),
            isLiked: Math.random() > 0.5,
            shares: Math.floor(Math.random() * 50),
            isShared: false,
            comments: (commentsData.comments || commentsData || []).slice(0, 3).map((comment: any, commentIndex: number) => ({
              id: comment.id?.toString() || `comment-${commentIndex}`,
              content: comment.body || comment.content,
              author: {
                id: comment.user?.id?.toString() || `user-${commentIndex}`,
                name: comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : `Commenter ${commentIndex + 1}`,
                username: comment.user?.username || `commenter${commentIndex + 1}`,
                avatar: comment.user?.image || `https://i.pravatar.cc/150?img=${commentIndex + 20}`
              },
              createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              likes: Math.floor(Math.random() * 10),
              isLiked: Math.random() > 0.7
            })),
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
          };
        } catch (error) {
          console.error('Error fetching post details:', error);
          return createFallbackPost(post, index);
        }
      })
    );

    return transformedPosts;

  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return mock data as fallback
    return generateMockPosts(limit);
  }
};

export const likePost = async (postId: string): Promise<LikeResponse> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    const success = Math.random() > 0.1;
    if (!success) {
      throw new Error('Like action failed');
    }

    return {
      success: true,
      likes: Math.floor(Math.random() * 200),
      isLiked: true // Always return true since user just liked it
    };
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const addComment = async (postId: string, content: string): Promise<CommentResponse> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = Math.random() > 0.1;
    if (!success) {
      throw new Error('Comment action failed');
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      author: {
        id: 'current-user',
        name: 'Current User',
        username: 'currentuser',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    return {
      success: true,
      comment: newComment
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const sharePost = async (postId: string): Promise<ShareResponse> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const success = Math.random() > 0.1;
    if (!success) {
      throw new Error('Share action failed');
    }

    return {
      success: true,
      shares: Math.floor(Math.random() * 100)
    };
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};

const createFallbackPost = (postData: any, index: number): Post => {
  return {
    id: postData.id?.toString() || `post-${index}`,
    content: postData.body || postData.content || "This is a post about technology and social media trends.",
    author: {
      id: postData.userId?.toString() || Math.random().toString(),
      name: 'Social User',
      username: 'socialuser',
      avatar: `https://i.pravatar.cc/150?img=${postData.userId || index + 1}`
    },
    likes: Math.floor(Math.random() * 100),
    isLiked: Math.random() > 0.5,
    shares: Math.floor(Math.random() * 50),
    isShared: false,
    comments: [],
    createdAt: new Date().toISOString()
  };
};

// Generate mock posts as fallback
const generateMockPosts = (count: number): Post[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-post-${i + 1}`,
    content: `This is a mock post ${i + 1} about social media and technology trends. This ensures you can always interact with the feed.`,
    author: {
      id: `mock-user-${i + 1}`,
      name: `Mock User ${i + 1}`,
      username: `mockuser${i + 1}`,
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`
    },
    likes: Math.floor(Math.random() * 100),
    isLiked: Math.random() > 0.5,
    shares: Math.floor(Math.random() * 50),
    isShared: false,
    comments: Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
      id: `mock-comment-${i}-${j}`,
      content: `This is comment ${j + 1} on mock post ${i + 1}`,
      author: {
        id: `mock-commenter-${j}`,
        name: `Commenter ${j + 1}`,
        username: `commenter${j + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${j + 10}`
      },
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 10),
      isLiked: Math.random() > 0.7
    })),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
  }));
};

// Default export for Expo Router
export default function ApiService() {
  return null;
}