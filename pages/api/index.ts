import { ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { PageConfig } from 'next';
import { ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schemas';

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: process.env.NODE_ENV === 'development' ? [ApolloServerPluginLandingPageGraphQLPlayground()] : [],
  context: ({ req }) => {
    try {
      const token = (req.headers.auth as string) || '';
      const { author } = jwt.verify(token, process.env.JWT_SECRET as string) as { author: string };
      const isAdmin = author === 'jsun969';
      return { isAdmin };
    } catch (error) {
      // throw new AuthenticationError('YouMustBeAdmin');
      return { isAdmin: false };
    }
  },
});

const startServer = apolloServer.start();

export default async function handler(req: MicroRequest, res: ServerResponse) {
  await startServer;
  await apolloServer.createHandler({
    path: '/api',
  })(req, res);
}
