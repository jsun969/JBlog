import { gql } from 'apollo-server-micro';

export const query = gql`
  type Query {
    adminAuth(key: String!, isJwt: Boolean): AdminAuth!
  }
`;
