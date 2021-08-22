import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
});

export default apolloClient;
