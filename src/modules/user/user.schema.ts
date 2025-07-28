import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    contactNumber: String
    isEmailVerified: Boolean!
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }
`;