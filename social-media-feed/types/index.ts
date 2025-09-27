// app/types/index.ts
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  author: User;
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}