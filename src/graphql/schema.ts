import { gql } from 'apollo-server-express';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { userTypeDefs } from './modules/user/user.schema';
import { teamTypeDefs } from './modules/team/team.schema';
import { playerTypeDefs } from './modules/player/player.schema';
import { dataDragonTypeDefs } from '../graphql/external/datadragon/datadragon.schema';
import { riotTypeDefs } from '../graphql/external/riot/riot.schema';
import { divisionTypeDefs } from './modules/division/division.schema';
import { tournamentTypeDefs } from './modules/tournament/tournament.schema';
import { seasonTypeDefs } from './modules/season/season.schema';
import { sessionTypeDefs } from './modules/session/session.schema';

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  userTypeDefs,
  teamTypeDefs,
  playerTypeDefs,
  dataDragonTypeDefs,
  riotTypeDefs,
  divisionTypeDefs,
  seasonTypeDefs,
  tournamentTypeDefs,
  sessionTypeDefs
]);
