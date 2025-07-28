import { gql } from 'apollo-server-express';

export const playerTypeDefs = gql`
  scalar Date
  scalar JSON

  extend type Query {
    players: [Player!]!
    player(id: ID!): Player
  }

  type LinkedAccount {
    id: ID!
    platform: String!
    accountIdentifier: String!
    metadata: JSON
    verified: Boolean!
    linkedAt: Date!
  }

  type RiotAccount {
    puuid: String!
    gameName: String!
    tagLine: String!
    region: String!
    verified: Boolean!
    linkedAt: Date!
  }

  type Player {
    id: ID!
    userId: ID!
    firstName: String!
    lastName: String!
    gender: String!
    dateOfBirth: Date!
    city: String
    countryCode: String
    profilePictureUrl: String
    playerRating: Int!
    currentTeamId: ID
    linkedAccounts: [LinkedAccount!]!
    riotAccount: RiotAccount
    createdAt: Date!
    updatedAt: Date!
    user: User!
  }
`;