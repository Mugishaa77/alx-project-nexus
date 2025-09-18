// utils/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// For now, let's use a mock endpoint - we'll replace this later
const httpLink = new HttpLink({
  uri: 'https://mockend.com/mockend/graphql', // Temporary mock
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;