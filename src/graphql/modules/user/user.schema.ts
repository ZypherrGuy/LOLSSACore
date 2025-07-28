// src/graphql/schema.ts
import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    Users: [User!]!
    User(id: ID!): User
  }
`;
