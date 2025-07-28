import { mergeResolvers } from '@graphql-tools/merge';

import { userResolvers }       from '../modules/user/user.resolver';
import { teamResolvers }       from '../modules/team/team.resolver';
import { playerResolvers }     from '../modules/player/player.resolver';
import { tournamentResolvers } from '../modules/tournament/tournament.resolver';
import { sessionResolvers }    from '../modules/session/session.resolver';
import { statsResolvers } from '../modules/stats/stats.resolver';

import { riotResolvers }       from '../integrations/riot/riot.resolver';
import { dataDragonResolvers } from '../integrations/datadragon/datadragon.resolver';

import { articleResolvers } from '../integrations/strapi/articles/article.resolver';
import { matchResolvers } from '../integrations/strapi/matches/match.resolver';
import { translationResolvers } from '../integrations/strapi/translations/translation.resolver';

import { authResolvers } from '../modules/auth/auth.resolver';

export const resolvers = mergeResolvers([
  userResolvers,
  teamResolvers,
  playerResolvers,
  tournamentResolvers,
  sessionResolvers,
  statsResolvers,
  riotResolvers,
  dataDragonResolvers,
  articleResolvers,
  matchResolvers,
  translationResolvers,
  authResolvers
]);
