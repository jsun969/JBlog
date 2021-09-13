import prisma from '../../../../lib/prisma';

export async function modifyFriend(
  _: unknown,
  { id, ...data }: { id: number; title: string; address: string; description: string; avatar: string },
  { isAdmin }: { isAdmin: boolean }
) {
  if (!isAdmin) return null;
  await prisma.friend.update({ where: { id }, data });
  return true;
}
