// types/index.ts
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  coverImage?: string;
  postsCount?: number;
  followers?: number;
  following?: number;
  joinedDate?: string;
  website?: string;
  location?: string;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  createdAt: string;
  imageUrl?: string;
  shares?: number;
  isShared?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

// API response types
export interface LikeResponse {
  success: boolean;
  likes: number;
  isLiked: boolean;
}

export interface CommentResponse {
  success: boolean;
  comment: Comment;
}

export interface ShareResponse {
  success: boolean;
  shares: number;
}

