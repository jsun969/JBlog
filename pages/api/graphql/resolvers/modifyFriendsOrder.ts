import prisma from '../../../../lib/prisma';

export async function modifyFriendsOrder(
  _: unknown,
  { orders }: { orders: { id: number; order: number }[] },
  { isAdmin }: { isAdmin: boolean }
) {
  if (!isAdmin) return null;
  for (const { id, order } of orders) {
    await prisma.friend.update({
      where: { id },
      data: { order },
    });
  }
  return true;
}
