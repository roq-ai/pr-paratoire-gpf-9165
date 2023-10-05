import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { clientProfileValidationSchema } from 'validationSchema/client-profiles';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';
import omit from 'lodash/omit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req);
  if (!session) {
    if (req.method === 'GET') {
      return getClientProfilesPublic();
    }
    return res.status(403).json({ message: `Forbidden` });
  }
  const { roqUserId, user } = session;
  switch (req.method) {
    case 'GET':
      return getClientProfiles();
    case 'POST':
      return createClientProfile();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getClientProfilesPublic() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const findOptions = convertQueryToPrismaUtil(query, 'client_profile');
    const countOptions = omit(findOptions, 'include');
    const [totalCount, data] = await prisma.$transaction([
      prisma.client_profile.count(countOptions as unknown),
      prisma.client_profile.findMany({
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

  async function getClientProfiles() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.client_profile
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'client_profile'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createClientProfile() {
    await clientProfileValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.form_b?.length > 0) {
      const create_form_b = body.form_b;
      body.form_b = {
        create: create_form_b,
      };
    } else {
      delete body.form_b;
    }
    if (body?.form_c?.length > 0) {
      const create_form_c = body.form_c;
      body.form_c = {
        create: create_form_c,
      };
    } else {
      delete body.form_c;
    }
    if (body?.order_current?.length > 0) {
      const create_order_current = body.order_current;
      body.order_current = {
        create: create_order_current,
      };
    } else {
      delete body.order_current;
    }
    if (body?.order_history_pharmacie?.length > 0) {
      const create_order_history_pharmacie = body.order_history_pharmacie;
      body.order_history_pharmacie = {
        create: create_order_history_pharmacie,
      };
    } else {
      delete body.order_history_pharmacie;
    }
    const data = await prisma.client_profile.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
