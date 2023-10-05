import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { orderCurrentValidationSchema } from 'validationSchema/order-currents';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';
import omit from 'lodash/omit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req);
  if (!session) {
    if (req.method === 'GET') {
      return getOrderCurrentsPublic();
    }
    return res.status(403).json({ message: `Forbidden` });
  }
  const { roqUserId, user } = session;
  switch (req.method) {
    case 'GET':
      return getOrderCurrents();
    case 'POST':
      return createOrderCurrent();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrderCurrentsPublic() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const findOptions = convertQueryToPrismaUtil(query, 'order_current');
    const countOptions = omit(findOptions, 'include');
    const [totalCount, data] = await prisma.$transaction([
      prisma.order_current.count(countOptions as unknown),
      prisma.order_current.findMany({
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
        ...findOptions,
      }),
    ]);
    return res.status(200).json({ totalCount, data });
  }

  async function getOrderCurrents() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.order_current
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'order_current'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createOrderCurrent() {
    await orderCurrentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.form_a_form_a_order_idToorder_current?.length > 0) {
      const create_form_a_form_a_order_idToorder_current = body.form_a_form_a_order_idToorder_current;
      body.form_a_form_a_order_idToorder_current = {
        create: create_form_a_form_a_order_idToorder_current,
      };
    } else {
      delete body.form_a_form_a_order_idToorder_current;
    }
    if (body?.form_b_form_b_order_idToorder_current?.length > 0) {
      const create_form_b_form_b_order_idToorder_current = body.form_b_form_b_order_idToorder_current;
      body.form_b_form_b_order_idToorder_current = {
        create: create_form_b_form_b_order_idToorder_current,
      };
    } else {
      delete body.form_b_form_b_order_idToorder_current;
    }
    if (body?.form_c_form_c_order_idToorder_current?.length > 0) {
      const create_form_c_form_c_order_idToorder_current = body.form_c_form_c_order_idToorder_current;
      body.form_c_form_c_order_idToorder_current = {
        create: create_form_c_form_c_order_idToorder_current,
      };
    } else {
      delete body.form_c_form_c_order_idToorder_current;
    }
    if (body?.order_history_client_order_history_client_order_created_atToorder_current?.length > 0) {
      const create_order_history_client_order_history_client_order_created_atToorder_current =
        body.order_history_client_order_history_client_order_created_atToorder_current;
      body.order_history_client_order_history_client_order_created_atToorder_current = {
        create: create_order_history_client_order_history_client_order_created_atToorder_current,
      };
    } else {
      delete body.order_history_client_order_history_client_order_created_atToorder_current;
    }
    if (body?.order_history_client_order_history_client_order_idToorder_current?.length > 0) {
      const create_order_history_client_order_history_client_order_idToorder_current =
        body.order_history_client_order_history_client_order_idToorder_current;
      body.order_history_client_order_history_client_order_idToorder_current = {
        create: create_order_history_client_order_history_client_order_idToorder_current,
      };
    } else {
      delete body.order_history_client_order_history_client_order_idToorder_current;
    }
    if (body?.order_history_client_order_history_client_order_statutToorder_current?.length > 0) {
      const create_order_history_client_order_history_client_order_statutToorder_current =
        body.order_history_client_order_history_client_order_statutToorder_current;
      body.order_history_client_order_history_client_order_statutToorder_current = {
        create: create_order_history_client_order_history_client_order_statutToorder_current,
      };
    } else {
      delete body.order_history_client_order_history_client_order_statutToorder_current;
    }
    if (body?.order_history_client_order_history_client_total_priceToorder_current?.length > 0) {
      const create_order_history_client_order_history_client_total_priceToorder_current =
        body.order_history_client_order_history_client_total_priceToorder_current;
      body.order_history_client_order_history_client_total_priceToorder_current = {
        create: create_order_history_client_order_history_client_total_priceToorder_current,
      };
    } else {
      delete body.order_history_client_order_history_client_total_priceToorder_current;
    }
    if (body?.order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current?.length > 0) {
      const create_order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current =
        body.order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current;
      body.order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current = {
        create: create_order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current,
      };
    } else {
      delete body.order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current;
    }
    if (body?.order_history_pharmacie_order_history_pharmacie_order_idToorder_current?.length > 0) {
      const create_order_history_pharmacie_order_history_pharmacie_order_idToorder_current =
        body.order_history_pharmacie_order_history_pharmacie_order_idToorder_current;
      body.order_history_pharmacie_order_history_pharmacie_order_idToorder_current = {
        create: create_order_history_pharmacie_order_history_pharmacie_order_idToorder_current,
      };
    } else {
      delete body.order_history_pharmacie_order_history_pharmacie_order_idToorder_current;
    }
    if (body?.order_history_pharmacie_order_history_pharmacie_order_statutToorder_current?.length > 0) {
      const create_order_history_pharmacie_order_history_pharmacie_order_statutToorder_current =
        body.order_history_pharmacie_order_history_pharmacie_order_statutToorder_current;
      body.order_history_pharmacie_order_history_pharmacie_order_statutToorder_current = {
        create: create_order_history_pharmacie_order_history_pharmacie_order_statutToorder_current,
      };
    } else {
      delete body.order_history_pharmacie_order_history_pharmacie_order_statutToorder_current;
    }
    if (body?.order_history_pharmacie_order_history_pharmacie_total_priceToorder_current?.length > 0) {
      const create_order_history_pharmacie_order_history_pharmacie_total_priceToorder_current =
        body.order_history_pharmacie_order_history_pharmacie_total_priceToorder_current;
      body.order_history_pharmacie_order_history_pharmacie_total_priceToorder_current = {
        create: create_order_history_pharmacie_order_history_pharmacie_total_priceToorder_current,
      };
    } else {
      delete body.order_history_pharmacie_order_history_pharmacie_total_priceToorder_current;
    }
    const data = await prisma.order_current.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
