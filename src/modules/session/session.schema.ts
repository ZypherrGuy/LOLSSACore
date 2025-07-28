import { gql } from 'apollo-server-express';

export const sessionTypeDefs = gql`
  scalar Date

  extend type Query {
    activeSessions: [Session!]!
  }

  type Session {
    id: ID!
    playerId: ID!
    createdAt: Date!
    expiresAt: Date!
    userAgent: String
    ipAddress: String
  }
`;