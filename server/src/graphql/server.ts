import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './types/schema';
import { squadResolvers } from './resolvers/squad.resolver';

export async function createApolloServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers: [squadResolvers],
    introspection: true,
  });

  await server.start();

  server.applyMiddleware({ app });

  return app;
} 