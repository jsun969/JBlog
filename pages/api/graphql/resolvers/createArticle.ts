import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import prisma from '../../../../lib/prisma';

export async function createArticle(
  _: unknown,
  {
    tags,
    createdAt,
    ...data
  }: {
    title: string;
    summary: string;
    link: string;
    archive: string;
    content: string;
    tags: string[];
    createdAt: string;
  },
  { isAdmin }: { isAdmin: boolean }
) {
  if (!isAdmin) return null;
  dayjs.extend(customParseFormat);
  const result = await prisma.article.create({
    data: {
      ...data,
      createdAt: createdAt ? dayjs(createdAt, 'YYYY-MM-DD HH:mm:ss').toDate() : undefined,
      tags: {
        connectOrCreate: tags.map((tag) => ({ where: { name: tag }, create: { name: tag } })),
      },
    },
  });

  return { ...result, tags };
}
