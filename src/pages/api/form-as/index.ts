import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { formAValidationSchema } from 'validationSchema/form-as';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';
import omit from 'lodash/omit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req);
  if (!session) {
    if (req.method === 'GET') {
      return getFormASPublic();
    }
    return res.status(403).json({ message: `Forbidden` });
  }
  const { roqUserId, user } = session;
  switch (req.method) {
    case 'GET':
      return getFormAS();
    case 'POST':
      return createFormA();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFormASPublic() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const findOptions = convertQueryToPrismaUtil(query, 'form_a');
    const countOptions = omit(findOptions, 'include');
    const [totalCount, data] = await prisma.$transaction([
      prisma.form_a.count(countOptions as unknown),
      prisma.form_a.findMany({
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

  async function getFormAS() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.form_a
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'form_a'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createFormA() {
    await formAValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.form_b_form_b_name_patientToform_a?.length > 0) {
      const create_form_b_form_b_name_patientToform_a = body.form_b_form_b_name_patientToform_a;
      body.form_b_form_b_name_patientToform_a = {
        create: create_form_b_form_b_name_patientToform_a,
      };
    } else {
      delete body.form_b_form_b_name_patientToform_a;
    }
    if (body?.form_b_form_b_sexToform_a?.length > 0) {
      const create_form_b_form_b_sexToform_a = body.form_b_form_b_sexToform_a;
      body.form_b_form_b_sexToform_a = {
        create: create_form_b_form_b_sexToform_a,
      };
    } else {
      delete body.form_b_form_b_sexToform_a;
    }
    if (body?.form_c?.length > 0) {
      const create_form_c = body.form_c;
      body.form_c = {
        create: create_form_c,
      };
    } else {
      delete body.form_c;
    }
    if (body?.order_current_order_current_form_a_idToform_a?.length > 0) {
      const create_order_current_order_current_form_a_idToform_a = body.order_current_order_current_form_a_idToform_a;
      body.order_current_order_current_form_a_idToform_a = {
        create: create_order_current_order_current_form_a_idToform_a,
      };
    } else {
      delete body.order_current_order_current_form_a_idToform_a;
    }
    if (body?.order_history_client?.length > 0) {
      const create_order_history_client = body.order_history_client;
      body.order_history_client = {
        create: create_order_history_client,
      };
    } else {
      delete body.order_history_client;
    }
    if (body?.pdf_file?.length > 0) {
      const create_pdf_file = body.pdf_file;
      body.pdf_file = {
        create: create_pdf_file,
      };
    } else {
      delete body.pdf_file;
    }
    const data = await prisma.form_a.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
