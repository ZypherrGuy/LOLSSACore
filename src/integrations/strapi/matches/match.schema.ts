import { gql } from 'apollo-server-express';

export const matchTypeDefs = gql`
  scalar Date

  type MatchSummary {
    id: ID!
    matchId: String!
    scheduledAt: Date!
    completed: Boolean!
  }

  extend type Query {
    matches: [MatchSummary!]!
  }
`;