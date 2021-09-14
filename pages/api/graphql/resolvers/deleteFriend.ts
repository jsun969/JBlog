import prisma from '../../../../lib/prisma';

export async function deleteFriend(_: unknown, { id }: { id: number }, { isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return null;
  await prisma.friend.delete({
    where: {
      id,
    },
  });
  return true;
}
