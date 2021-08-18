import { gql } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';

export const adminAuthSchema = gql`
  type AdminAuth {
    status: Boolean!
    jwt: String
  }
`;

export const adminAuthResolver = {
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
        if (key === process.env.ADMIN_KEY) {
          return {
            status: true,
            jwt: jwt.sign({ author: 'jsun969' }, process.env.JWT_SECRET as string, { expiresIn: 86400 }),
          };
        } else {
          return {
            status: false,
            jwt: null,
          };
        }
      }
    },
  },
};
