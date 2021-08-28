import prisma from '../../../../lib/prisma';

export const likeArticle = {
  Mutation: {
    async likeArticle(_: unknown, { link }: { link: string }) {
      return await prisma.article.update({
        where: { link: link },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
    },
  },
};
