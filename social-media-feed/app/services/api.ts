// app/services/api.ts
import { Post } from "../../types";

const API_BASE_URL = 'https://dummyjson.com';

// Main API service functions
export const getPosts = async (page: number = 1, limit: number = 10): Promise<Post[]> => {
  try {
    const skip = (page - 1) * limit;
    const response = await fetch(
      `${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`
    );
    const data = await response.json();

    const postsWithDetails = await Promise.all(
      data.posts.map(async (post: any) => {
        try {
          const userResponse = await fetch(`${API_BASE_URL}/users/${post.userId}`);
          const user = await userResponse.json();

          const commentsResponse = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`);
          const commentsData = await commentsResponse.json();

          return {
            id: post.id.toString(),
            content: post.body,
            author: {
              id: user.id.toString(),
              name: `${user.firstName} ${user.lastName}`,
              username: user.username,
              avatar: user.image || `https://i.pravatar.cc/150?img=${user.id}`
            },
            likes: post.reactions ? post.reactions : Math.floor(Math.random() * 100),
            isLiked: Math.random() > 0.5,
            comments: commentsData.comments.slice(0, 3).map((comment: any) => ({
              id: comment.id.toString(),
              content: comment.body,
              author: {
                id: comment.user.id.toString(),
                name: `${comment.user.firstName} ${comment.user.lastName}`,
                username: comment.user.username,
                avatar: comment.user.image || `https://i.pravatar.cc/150?img=${comment.user.id + 10}`
              },
              createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            })),
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
          };
        } catch (error) {
          console.error('Error fetching post details:', error);
          return createFallbackPost(post);
        }
      })
    );

    return postsWithDetails;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

const createFallbackPost = (postData: any): Post => {
  return {
    id: postData.id.toString(),
    content: postData.body || "This is a post about technology and social media trends in today's digital world.",
    author: {
      id: postData.userId?.toString() || Math.random().toString(),
      name: 'Social User',
      username: 'socialuser',
      avatar: `https://i.pravatar.cc/150?img=${postData.userId || 1}`
    },
    likes: Math.floor(Math.random() * 100),
    isLiked: Math.random() > 0.5,
    comments: [],
    createdAt: new Date().toISOString()
  };
};

export const likePost = async (postId: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};

export const addComment = async (postId: string, content: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};

// Default export for Expo Router (to fix the warning)
export default function ApiService() {
  return null; // This is just to satisfy Expo Router's default export requirement
}