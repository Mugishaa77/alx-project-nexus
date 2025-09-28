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



// GraphQL-like query interfaces
export interface PostsQuery {
  posts: Post[];
  hasMore: boolean;
  page: number;
}

export interface CommentMutation {
  comment: Comment;
}

export interface LikeMutation {
  success: boolean;
  post: Post;
}

export interface ShareMutation {
  success: boolean;
  post: Post;
}

// API Response interfaces
export interface JSONPlaceholderPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface JSONPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface JSONPlaceholderComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}