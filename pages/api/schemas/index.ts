import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type AdminAuth {
    status: Boolean!
    jwt: String
  }

  type Query {
    adminAuth(key: String!, isJwt: Boolean): AdminAuth
  }
`;
