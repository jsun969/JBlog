import prisma from '../../../../lib/prisma';

export async function likeArticle(_: unknown, { link }: { link: string }) {
  return await prisma.article.update({
    where: { link: link },
    data: {
      likes: { increment: 1 },
    },
  });
}
