import { ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { typeDefs } from './graphql/schemas';
import { resolvers } from './graphql/resolvers';
import { PageConfig } from 'next';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: process.env.NODE_ENV === 'development' ? [ApolloServerPluginLandingPageGraphQLPlayground()] : [],
});

const startServer = apolloServer.start();

export default async function handler(req: MicroRequest, res: ServerResponse) {
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}
