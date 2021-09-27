import { gql } from 'apollo-server-micro';

export const mutation = gql`
  input Order {
    id: Int!
    order: Int!
  }

  type Mutation {
    createArticle(
      title: String!
      summary: String!
      link: String!
      archive: String!
      content: String!
      tags: [String]!
      createdAt: String
    ): Article!
    likeArticle(link: String!): Boolean!
    deleteArticle(id: Int!): Boolean!
    modifyArticle(
      id: Int
      title: String
      summary: String
      link: String
      archive: String
      content: String
      tags: [String]
    ): Boolean!
    modifyAbout(content: String!): Boolean!
    createFriend(name: String!, address: String!, description: String!, avatar: String!): Int!
    modifyFriend(id: Int!, name: String, address: String, description: String, avatar: String): Boolean!
    deleteFriend(id: Int!): Boolean!
    modifyBulletin(content: String!): Boolean!
    modifyFriendsOrder(orders: [Order]!): Boolean!
  }
`;
