import { gql } from 'apollo-server-micro';

export const mutation = gql`
  type Mutation {
    createArticle(
      title: String!
      summary: String!
      link: String!
      archive: String!
      content: String!
      tags: [String]!
    ): Article!
    likeArticle(link: String!): Article
    deleteArticle(id: Int!): Article
  }
`;
