import { gql } from 'apollo-server-express';

export const tournamentTypeDefs = gql`
  scalar Date

  type Tournament {
    id: ID!
    utid: String!
    name: String!
    description: String
    prizePool: Float
    registrationOpenDate: Date
    registrationCloseDate: Date
    startDate: Date!       
    endDate: Date    
    seasonId: ID!
    strapiTournamentImageId: String 
    split: String
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Query {
    Tournaments: [Tournament!]!
    Tournament(id: ID!): Tournament
  }
`;
