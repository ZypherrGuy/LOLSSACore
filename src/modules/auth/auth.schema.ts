import { gql } from 'apollo-server-express';

export const authTypeDefs = gql`
  extend type Mutation {
    signIn(email: String!, password: String!): LoginResponse!
    signOut: Boolean!
  }

  type LoginResponse {
    token: String!
    player: Player!
  }
`;