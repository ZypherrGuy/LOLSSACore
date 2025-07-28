import { gql } from 'apollo-server-express';

export const statsTypeDefs = gql`
  scalar Date
  scalar JSON

  extend type Query {
    weeklyPlayerStats(weekStart: Date!): [PlayerStats!]!
    weeklyTeamStats(weekStart: Date!): [TeamStats!]!
    playerAwards(weekStart: Date!): [PlayerWeeklyAward!]!
    teamAwards(weekStart: Date!): [TeamWeeklyAward!]!
  }

  type PlayerStats {
    player: Player!
    stats: JSON!
  }

  type TeamStats {
    team: Team!
    stats: JSON!
  }

  type AwardType {
    id: ID!
    name: String!
    logoUrl: String
  }

  type PlayerWeeklyAward {
    awardType: AwardType!
    player: Player!
  }

  type TeamWeeklyAward {
    awardType: AwardType!
    team: Team!
  }
`;
