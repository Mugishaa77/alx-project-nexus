// app/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      edges {
        node {
          id
          content
          imageUrl
          author {
            id
            name
            username
            avatar
          }
          likes
          isLiked
          comments {
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
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      content
      imageUrl
      author {
        id
        name
        username
        avatar
      }
      likes
      isLiked
      comments {
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
      createdAt
    }
  }
`;

export default function GraphQLQueries() {
  return null;
}