// types/index.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  image?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}