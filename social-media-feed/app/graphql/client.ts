// app/graphql/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For mobile, you might need to adjust the API endpoint
const API_URL = Platform.select({
  ios: 'http://localhost:4000/graphql',
  android: 'http://10.0.2.2:4000/graphql', // Android emulator
  default: 'https://your-api.com/graphql'
});

const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext(async (_, { headers }) => {
  // Use AsyncStorage for mobile token storage
  const token = await AsyncStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing = {}, incoming) {
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...incoming.edges],
              };
            },
          },
        },
      },
    },
  }),
});

export default function GraphQLClient() {
  return null;
}