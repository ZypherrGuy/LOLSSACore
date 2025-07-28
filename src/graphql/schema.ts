import { makeExecutableSchema }      from '@graphql-tools/schema';
import { mergeTypeDefs }             from '@graphql-tools/merge';

import { resolvers }                 from './resolvers';

import { userTypeDefs }              from '../modules/user/user.schema';
import { teamTypeDefs }              from '../modules/team/team.schema';
import { playerTypeDefs }            from '../modules/player/player.schema';
import { statsTypeDefs }          from '../modules/stats/stats.schema';
import { tournamentTypeDefs }        from '../modules/tournament/tournament.schema';
import { sessionTypeDefs }           from '../modules/session/session.schema';

import { riotTypeDefs }              from '../integrations/riot/riot.schema';
import { dataDragonTypeDefs }        from '../integrations/datadragon/datadragon.schema';

import { articleTypeDefs } from '../integrations/strapi/articles/article.schema';
import { matchTypeDefs } from '../integrations/strapi/matches/match.schema';
import { translationTypeDefs } from '../integrations/strapi/translations/translation.schema';

const baseTypeDefs = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  userTypeDefs,
  teamTypeDefs,
  playerTypeDefs,
  statsTypeDefs,
  tournamentTypeDefs,
  sessionTypeDefs,
  riotTypeDefs,
  dataDragonTypeDefs,
  articleTypeDefs,
  matchTypeDefs,
  translationTypeDefs
]);

export const schema = makeExecutableSchema({ typeDefs, resolvers });
