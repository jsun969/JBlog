import { gql } from 'apollo-server-micro';

export const adminAuth = gql`
  type AdminAuth {
    status: Boolean!
    jwt: String
  }
`;
