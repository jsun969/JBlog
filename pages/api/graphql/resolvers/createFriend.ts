import prisma from '../../../../lib/prisma';

export async function createFriend(
  _: unknown,
  { ...data }: { title: string; address: string; description: string; avatar: string },
  { isAdmin }: { isAdmin: boolean }
) {
  if (!isAdmin) return null;
  await prisma.friend.create({ data });
  return true;
}
