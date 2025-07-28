import { gql } from 'apollo-server-express';

export const teamTypeDefs = gql`
  type Team {
    id: ID!
    strapiTeamLogoId: String
    name: String!
    owner: ID!
    coach: ID
    manager: ID
    players: [ID!]!
    twitter: String!
    utid: String!
    tournaments: [ID!]!
  }

  extend type Query {
    Teams: [Team!]!
    Team(id: ID!): Team
  }
`;
