import prisma from '../../../../lib/prisma';

export async function createArticle(
  _: unknown,
  {
    tags,
    ...data
  }: {
    title: string;
    summary: string;
    link: string;
    archive: string;
    content: string;
    tags: string[];
  },
  { isAdmin }: { isAdmin: boolean }
) {
  if (!isAdmin) return null;
  const result = await prisma.article.create({
    data: {
      ...data,
      tags: {
        connectOrCreate: tags.map((tag) => ({ where: { name: tag }, create: { name: tag } })),
      },
    },
  });

  return { ...result, tags };
}
