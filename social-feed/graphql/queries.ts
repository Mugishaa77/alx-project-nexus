// graphql/queries.ts
import { gql } from '@apollo/client';
import { mockPosts } from '@/utils/mockData';

export const GET_POSTS = gql`
  query GetPosts($offset: Int!, $limit: Int!) {
    posts(offset: $offset, limit: $limit) {
      id
      content
      createdAt
      image
      likes
      isLiked
      author {
        id
        name
        avatar
      }
      comments {
        id
        content
        createdAt
        likes
        author {
          id
          name
          avatar
        }
      }
    }
  }
`;

// Mock resolver for development
export const mockGetPosts = (offset: number, limit: number) => {
  return {
    posts: mockPosts.slice(offset, offset + limit),
  };
};