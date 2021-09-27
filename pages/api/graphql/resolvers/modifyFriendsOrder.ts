import prisma from '../../../../lib/prisma';

export async function modifyFriendsOrder(
  _: unknown,
  { orders }: { orders: { id: number; order: number }[] },
  { isAdmin }: { isAdmin: boolean }
) {
  if (!isAdmin) return null;
  console.log(orders);
  await Promise.all(
    orders.map(({ id, order }) => {
      return prisma.friend.update({
        where: { id },
        data: { order },
      });
    })
  );
  return true;
}
