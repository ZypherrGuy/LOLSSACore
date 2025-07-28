import { gql } from 'apollo-server-express';

export const teamTypeDefs = gql`
  scalar Date

  extend type Query {
    teams: [Team!]!
    team(id: ID!): Team
  }

  type TeamSocialAccount {
    id: ID!
    platform: String!
    accountUrl: String!
  }

  type Team {
    id: ID!
    name: String!
    tag: String!
    logoUrl: String
    bio: String
    genderType: String!
    createdBy: ID
    createdAt: Date!
    updatedAt: Date!
    players: [Player!]!
    socialAccounts: [TeamSocialAccount!]!
  }
`;