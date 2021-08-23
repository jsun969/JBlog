import prisma from '../../../../lib/prisma';

export const createArticle = {
  Mutation: {
    async createArticle(
      _: unknown,
      {
        title,
        summary,
        link,
        archive,
        content,
        image,
        tags,
      }: {
        title: string;
        summary: string;
        link: string;
        archive: string;
        content: string;
        image: string;
        tags: string[];
      },
      { isAdmin }: { isAdmin: boolean }
    ) {
      if (!isAdmin) return null;
      const result = await prisma.article.create({
        data: {
          title,
          summary,
          link,
          archive,
          content,
          image,
          tags: {
            connectOrCreate: tags.map((tag) => ({ where: { name: tag }, create: { name: tag } })),
          },
        },
      });
      return { ...result, tags };
    },
  },
};
