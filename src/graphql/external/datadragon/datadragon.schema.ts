import { gql } from 'apollo-server-express';

export const dataDragonTypeDefs = gql`
  type ChampionImage {
    full: String!
    sprite: String!
    group: String!
    x: Int!
    y: Int!
    w: Int!
    h: Int!
  }

  type Champion {
    id: String!
    key: String!
    name: String!
    title: String!
    image: ChampionImage!
  }

  extend type Query {
    champions: [Champion!]!
    championByKey(key: String!): Champion
  }
`;
