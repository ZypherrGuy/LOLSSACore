import { gql } from 'apollo-server-express';

export const articleTypeDefs = gql`
  scalar Date

  type Article {
    id: ID!
    title: String!
    content: String!
    publishedAt: Date!
  }

  extend type Query {
    articles: [Article!]!
  }
`;