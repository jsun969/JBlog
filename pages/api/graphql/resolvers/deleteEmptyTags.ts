import prisma from '../../../../lib/prisma';

export async function deleteEmptyTags(_: unknown, __: unknown, { isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return null;
  const { count } = await prisma.tag.deleteMany({
    where: {
      articles: { none: {} },
    },
  });
  return count;
}
