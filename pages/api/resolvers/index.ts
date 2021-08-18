import jwt from 'jsonwebtoken';

export const resolvers = {
  Query: {
    adminAuth(_: unknown, { key, isJwt }: { key: string; isJwt: boolean }) {
      if (isJwt) {
        try {
          const { author } = jwt.verify(key, process.env.JWT_SECRET as string) as { author: string };
          return {
            status: author === 'jsun969',
            jwt: null,
          };
        } catch {
          return {
            status: false,
            jwt: null,
          };
        }
      } else {
        return {
          status: key === process.env.ADMIN_KEY,
          jwt: jwt.sign({ author: 'jsun969' }, process.env.JWT_SECRET as string, { expiresIn: 86400 }),
        };
      }
    },
  },
};
