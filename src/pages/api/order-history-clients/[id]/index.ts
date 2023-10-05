import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware, notificationHandlerMiddleware } from 'server/middlewares';
import { orderHistoryClientValidationSchema } from 'validationSchema/order-history-clients';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  const allowed = await prisma.order_history_client
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
      return getOrderHistoryClientById();
    case 'PUT':
      return updateOrderHistoryClientById();
    case 'DELETE':
      return deleteOrderHistoryClientById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrderHistoryClientById() {
    const data = await prisma.order_history_client.findFirst(
      convertQueryToPrismaUtil(req.query, 'order_history_client'),
    );
    return res.status(200).json(data);
  }

  async function updateOrderHistoryClientById() {
    await orderHistoryClientValidationSchema.validate(req.body);
    const data = await prisma.order_history_client.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
  async function deleteOrderHistoryClientById() {
    await notificationHandlerMiddleware(req, req.query.id as string);
    const data = await prisma.order_history_client.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
