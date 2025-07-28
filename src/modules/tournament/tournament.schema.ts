import { gql } from 'apollo-server-express';

export const tournamentTypeDefs = gql`
  scalar Date

  union TournamentEntry = Player | Team

  type Placement {
    first: TournamentEntry!
    second: TournamentEntry!
    third: TournamentEntry!
  }

  type MatchSummary {
    id: ID!
    matchId: String!
    scheduledAt: Date
    completed: Boolean!
  }

  extend type Query {
    tournaments: [Tournament!]!
    tournament(id: ID!): Tournament
  }

  type Tournament {
    id: ID!
    name: String!
    slug: String!
    description: String
    logoUrl: String
    bannerUrl: String
    prizePool: Float
    organizerName: String
    organizerDiscordUrl: String
    organizerWebsiteUrl: String
    status: String!
    format: String!
    startDate: Date
    endDate: Date
    createdAt: Date!
    updatedAt: Date!
    placements: Placement
    matches: [MatchSummary!]!
  }
`;