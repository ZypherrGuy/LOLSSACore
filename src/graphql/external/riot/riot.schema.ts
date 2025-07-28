// src/graphql/external/riot/riot.schema.ts
import { gql } from 'apollo-server-express';

export const riotTypeDefs = gql`
  # Define a custom scalar for JSON fields.
  scalar JSON

  # Extend the root Query type with our Riot queries.
  extend type Query {
    RiotAccount(gameName: String!, tagLine: String!): RiotAccount
    match(matchId: String!): MatchDto
  }

  # Riot account type.
  type RiotAccount {
    puuid: String!
    gameName: String!
    tagLine: String!
  }

  # The complete Match type returned from Riot.
  type MatchDto {
    metadata: MetadataDto!
    info: InfoDto!
  }

  # Match metadata.
  type MetadataDto {
    dataVersion: String!
    matchId: String!
    participants: [String!]!
  }

  # Match info containing all game details.
  type InfoDto {
    endOfGameResult: String!
    gameCreation: Float!
    gameDuration: Float!
    gameEndTimestamp: Float
    gameId: Float!
    gameMode: String!
    gameName: String!
    gameStartTimestamp: Float!
    gameType: String!
    gameVersion: String!
    mapId: Int!
    platformId: String!
    queueId: Int!
    tournamentCode: String!
    participants: [ParticipantDto!]!
    teams: [TeamDto!]!
  }

  # Participant details.
  type ParticipantDto {
    allInPings: Int!
    assistMePings: Int!
    assists: Int!
    baronKills: Int!
    bountyLevel: Int!
    champExperience: Int!
    champLevel: Int!
    championId: Int!
    championName: String!
    commandPings: Int!
    championTransform: Int!
    consumablesPurchased: Int!
    challenges: JSON
    damageDealtToBuildings: Int!
    damageDealtToObjectives: Int!
    damageDealtToTurrets: Int!
    damageSelfMitigated: Int!
    deaths: Int!
    detectorWardsPlaced: Int!
    doubleKills: Int!
    dragonKills: Int!
    eligibleForProgression: Boolean!
    enemyMissingPings: Int!
    enemyVisionPings: Int!
    firstBloodAssist: Boolean!
    firstBloodKill: Boolean!
    firstTowerAssist: Boolean!
    firstTowerKill: Boolean!
    gameEndedInEarlySurrender: Boolean!
    gameEndedInSurrender: Boolean!
    holdPings: Int!
    getBackPings: Int!
    goldEarned: Int!
    goldSpent: Int!
    individualPosition: String!
    inhibitorKills: Int!
    inhibitorTakedowns: Int!
    inhibitorsLost: Int!
    item0: Int!
    item1: Int!
    item2: Int!
    item3: Int!
    item4: Int!
    item5: Int!
    item6: Int!
    itemsPurchased: Int!
    killingSprees: Int!
    kills: Int!
    lane: String!
    largestCriticalStrike: Int!
    largestKillingSpree: Int!
    largestMultiKill: Int!
    longestTimeSpentLiving: Int!
    magicDamageDealt: Int!
    magicDamageDealtToChampions: Int!
    magicDamageTaken: Int!
    neutralMinionsKilled: Int!
    needVisionPings: Int!
    nexusKills: Int!
    nexusTakedowns: Int!
    nexusLost: Int!
    objectivesStolen: Int!
    objectivesStolenAssists: Int!
    onMyWayPings: Int!
    participantId: Int!
    # These fields are now nullable since the API may return null.
    playerScore0: Int
    playerScore1: Int
    playerScore2: Int
    playerScore3: Int
    playerScore4: Int
    playerScore5: Int
    playerScore6: Int
    playerScore7: Int
    playerScore8: Int
    playerScore9: Int
    playerScore10: Int
    playerScore11: Int
    pentaKills: Int!
    perks: JSON
    physicalDamageDealt: Int!
    physicalDamageDealtToChampions: Int!
    physicalDamageTaken: Int!
    placement: Int!
    playerAugment1: Int!
    playerAugment2: Int!
    playerAugment3: Int!
    playerAugment4: Int!
    playerSubteamId: Int!
    pushPings: Int!
    profileIcon: Int!
    puuid: String!
    quadraKills: Int!
    riotIdGameName: String!
    riotIdTagline: String!
    role: String!
    sightWardsBoughtInGame: Int!
    spell1Casts: Int!
    spell2Casts: Int!
    spell3Casts: Int!
    spell4Casts: Int!
    subteamPlacement: Int!
    summoner1Casts: Int!
    summoner1Id: Int!
    summoner2Casts: Int!
    summoner2Id: Int!
    summonerId: String!
    summonerLevel: Int!
    summonerName: String!
    teamEarlySurrendered: Boolean!
    teamId: Int!
    teamPosition: String!
    timeCCingOthers: Int!
    timePlayed: Int!
    totalAllyJungleMinionsKilled: Int!
    totalDamageDealt: Int!
    totalDamageDealtToChampions: Int!
    totalDamageShieldedOnTeammates: Int!
    totalDamageTaken: Int!
    totalEnemyJungleMinionsKilled: Int!
    totalHeal: Int!
    totalHealsOnTeammates: Int!
    totalMinionsKilled: Int!
    totalTimeCCDealt: Int!
    totalTimeSpentDead: Int!
    totalUnitsHealed: Int!
    tripleKills: Int!
    trueDamageDealt: Int!
    trueDamageDealtToChampions: Int!
    trueDamageTaken: Int!
    turretKills: Int!
    turretTakedowns: Int!
    turretsLost: Int!
    unrealKills: Int!
    visionScore: Int!
    visionClearedPings: Int!
    visionWardsBoughtInGame: Int!
    wardsKilled: Int!
    wardsPlaced: Int!
    win: Boolean!
  }

  # Team details.
  type TeamDto {
    bans: [BanDto!]!
    objectives: ObjectivesDto!
    teamId: Int!
    win: Boolean!
  }

  type BanDto {
    championId: Int!
    pickTurn: Int!
  }

  type ObjectivesDto {
    baron: ObjectiveDto!
    champion: ObjectiveDto!
    dragon: ObjectiveDto!
    inhibitor: ObjectiveDto!
    riftHerald: ObjectiveDto!
    tower: ObjectiveDto!
  }

  type ObjectiveDto {
    first: Boolean!
    kills: Int!
  }
`;
