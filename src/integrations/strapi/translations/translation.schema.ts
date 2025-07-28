import { gql } from 'apollo-server-express';

export const translationTypeDefs = gql`
  type Translation {
    id: ID!
    key: String!
    value: String!
    locale: String!
  }

  extend type Query {
    translations(locale: String!): [Translation!]!
  }
`;