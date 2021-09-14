import prisma from '../../../../lib/prisma';

export async function createFriend(
  _: unknown,
  { ...data }: { name: string; address: string; description: string; avatar: string },
  { isAdmin }: { isAdmin: boolean }
) {
  if (!isAdmin) return null;
  const { id } = await prisma.friend.create({ data });
  return id;
}
