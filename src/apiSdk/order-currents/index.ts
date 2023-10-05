import queryString from 'query-string';
import { OrderCurrentInterface, OrderCurrentGetQueryInterface } from 'interfaces/order-current';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getOrderCurrents = async (
  query?: OrderCurrentGetQueryInterface,
): Promise<PaginatedInterface<OrderCurrentInterface>> => {
  return fetcher('/api/order-currents', {}, query);
};

export const createOrderCurrent = async (orderCurrent: OrderCurrentInterface) => {
  return fetcher('/api/order-currents', { method: 'POST', body: JSON.stringify(orderCurrent) });
};

export const updateOrderCurrentById = async (id: string, orderCurrent: OrderCurrentInterface) => {
  return fetcher(`/api/order-currents/${id}`, { method: 'PUT', body: JSON.stringify(orderCurrent) });
};

export const getOrderCurrentById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/order-currents/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteOrderCurrentById = async (id: string) => {
  return fetcher(`/api/order-currents/${id}`, { method: 'DELETE' });
};
