import { gql } from 'apollo-server-micro';

export const mutation = gql`
  type Mutation {
    createArticle(
      title: String!
      summary: String!
      link: String!
      archive: String!
      content: String!
      image: String
      tags: [String]
    ): Article!
  }
`;
