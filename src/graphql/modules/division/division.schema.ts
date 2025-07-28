import { gql } from 'apollo-server-express';

export const divisionTypeDefs = gql`
  type Division {
  id: ID!
  tournamentId: ID!
  utid: String!
  divisionType: String!  # Changed from DivisionType to String
  createdAt: Date!
  updatedAt: Date!
  }

  extend type Query {
    Divisions: [Division!]!
    Division(id: ID!): Division
  }
`;
