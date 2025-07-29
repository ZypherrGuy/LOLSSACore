import { gql } from 'apollo-server-express';

export const authTypeDefs = gql`
  extend type Mutation {
    signIn(email: String!, password: String!): LoginResponse!
    signOut: Boolean!
    register(
      username:    String!
      email:       String!
      password:    String!
      firstName:   String!
      lastName:    String!
      gender:      String!
      dateOfBirth: String!   # parse this as ISO-8601 on the server
      countryCode: String
    ): LoginResponse!   
    verifyEmail(token: String!): Boolean!         
    requestPasswordReset(email: String!): Boolean!
    resetPassword(token: String!, newPassword: String!): Boolean!
  }

  type LoginResponse {
    token: String!
    player: Player!
  }
`;