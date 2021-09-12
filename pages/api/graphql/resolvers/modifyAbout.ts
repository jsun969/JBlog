import prisma from '../../../../lib/prisma';

export async function modifyAbout(_: unknown, { content }: { content: string }, { isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return null;
  await prisma.about.upsert({ where: { id: 0 }, update: { content }, create: { content } });
  return true;
}
