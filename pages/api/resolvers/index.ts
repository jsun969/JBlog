import crypto from 'crypto';

export const resolvers = {
  Query: {
    adminAuth(_: unknown, { key, encrypted }: { key: string; encrypted: boolean }) {
      if (encrypted) {
        return (
          key ===
          crypto
            .createHash('sha256')
            .update(process.env.ADMIN_KEY as string)
            .digest('hex')
        );
      } else {
        return key === process.env.ADMIN_KEY;
      }
    },
  },
};
