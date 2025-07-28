import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './modules/user/user.resolver';
import { teamResolvers } from './modules/team/team.resolver';
import { playerResolvers } from './modules/player/player.resolver';
import { divisionResolvers } from './modules/division/division.resolver';
import { tournamentResolvers } from './modules/tournament/tournament.resolver';
import { seasonResolvers } from './modules/season/season.resolver';
import { riotResolvers } from './external/riot/riot.resolver';
import { dataDragonResolvers } from './external/datadragon/datadragon.resolver';
import { sessionResolvers } from './modules/session/session.resolver';

export const resolvers = mergeResolvers([
  seasonResolvers,
  tournamentResolvers,
  divisionResolvers,
  userResolvers,
  teamResolvers,
  playerResolvers,
  riotResolvers,
  dataDragonResolvers,
  sessionResolvers
]);
