// app/graphql/mutations.ts
import { gql } from '@apollo/client';

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes
      isLiked
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      id
      content
      author {
        id
        name
        username
        avatar
      }
      createdAt
    }
  }
`;

export default function GraphQLMutations() {
  return null;
}