import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Query {
    adminAuth(key: String!, encrypted: Boolean): Boolean!
  }
`;
