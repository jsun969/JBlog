import prisma from '../../../../lib/prisma';

export const modifyArticle = {
  Mutation: {
    async modifyArticle(
      _: unknown,
      {
        id,
        title,
        summary,
        link,
        archive,
        content,
        tags,
      }: { id: number; title: string; summary: string; link: string; archive: string; content: string; tags: string[] },
      { isAdmin }: { isAdmin: boolean }
    ) {
      if (!isAdmin) return null;
      return await prisma.article.update({
        where: {
          id,
        },
        data: {
          title,
          summary,
          link,
          archive,
          content,
          tags: {
            set: [],
            connectOrCreate: tags?.map((tag) => ({ where: { name: tag }, create: { name: tag } })),
          },
        },
      });
    },
  },
};
