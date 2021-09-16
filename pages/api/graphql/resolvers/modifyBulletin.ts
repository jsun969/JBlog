import prisma from '../../../../lib/prisma';

export async function modifyBulletin(_: unknown, { content }: { content: string }, { isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return null;
  await prisma.bulletin.upsert({ where: { id: 0 }, update: { content }, create: { content } });
  return true;
}
