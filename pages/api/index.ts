import { ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { typeDefs } from './graphql/schemas';
import { resolvers } from './graphql/resolvers';
import { PageConfig } from 'next';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import jwt from 'jsonwebtoken';

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
