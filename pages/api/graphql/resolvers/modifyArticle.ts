import prisma from '../../../../lib/prisma';

export async function modifyArticle(
  _: unknown,
  {
    id,
    tags,
    ...data
  }: { id: number; title: string; summary: string; link: string; archive: string; content: string; tags: string[] },
  { isAdmin }: { isAdmin: boolean }
) {
  if (!isAdmin) return null;
  await prisma.article.update({
    where: {
      id,
    },
    data: {
      ...data,
      tags: tags
        ? {
            set: [],
            connectOrCreate: tags?.map((tag) => ({ where: { name: tag }, create: { name: tag } })),
          }
        : undefined,
    },
  });
  return true;
}
