import { gql } from 'apollo-server-micro';

export const article = gql`
  type Article {
    id: Int
    title: String
    summary: String
    link: String
    archive: String
    content: String
    image: String
    tags: [String]
  }
`;
