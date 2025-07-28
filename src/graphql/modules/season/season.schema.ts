import { gql } from 'apollo-server-express';

export const seasonTypeDefs = gql`
  scalar Date

  type Season {
    id: ID!
    seasonYear: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Query {
    Seasons: [Season!]!
    Season(id: ID!): Season
  }
`;
