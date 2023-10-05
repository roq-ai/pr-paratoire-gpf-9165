import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware, notificationHandlerMiddleware } from 'server/middlewares';
import { orderHistoryPharmacieValidationSchema } from 'validationSchema/order-history-pharmacies';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  const allowed = await prisma.order_history_pharmacie
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      return getOrderHistoryPharmacieById();
    case 'PUT':
      return updateOrderHistoryPharmacieById();
    case 'DELETE':
      return deleteOrderHistoryPharmacieById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrderHistoryPharmacieById() {
    const data = await prisma.order_history_pharmacie.findFirst(
      convertQueryToPrismaUtil(req.query, 'order_history_pharmacie'),
    );
    return res.status(200).json(data);
  }

  async function updateOrderHistoryPharmacieById() {
    await orderHistoryPharmacieValidationSchema.validate(req.body);
    const data = await prisma.order_history_pharmacie.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
  async function deleteOrderHistoryPharmacieById() {
    await notificationHandlerMiddleware(req, req.query.id as string);
    const data = await prisma.order_history_pharmacie.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
