import prisma from '../../../../lib/prisma';

export const deleteArticle = {
  Mutation: {
    async deleteArticle(_: unknown, { id }: { id: number }, { isAdmin }: { isAdmin: boolean }) {
      if (!isAdmin) return null;
      return await prisma.article.delete({
        where: {
          id,
        },
      });
    },
  },
};
