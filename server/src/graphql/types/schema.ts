import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Squad {
    id: ID!
    name: String!
    code: String!
    description: String
    createdAt: String
    updatedAt: String
    members: [Member!]!
  }

  type Member {
    id: ID!
    fullName: String!
    email: String!
    position: String
    pid: String
    status: String
    avatarUrl: String
  }

  type Query {
    squads: [Squad!]!
    squad(id: ID!): Squad
  }
`; 