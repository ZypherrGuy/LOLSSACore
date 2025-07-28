import { gql } from 'apollo-server-express';

export const sessionTypeDefs = gql`
  scalar Date

  type Session {
    id: ID!
    playerid: ID!
    created_at: Date
    expires_at: Date!
  }

  type Query {
    activeSessions: [Session!]!
  }
`;
