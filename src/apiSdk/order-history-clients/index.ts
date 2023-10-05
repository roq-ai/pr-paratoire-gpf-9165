import queryString from 'query-string';
import { OrderHistoryClientInterface, OrderHistoryClientGetQueryInterface } from 'interfaces/order-history-client';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getOrderHistoryClients = async (
  query?: OrderHistoryClientGetQueryInterface,
): Promise<PaginatedInterface<OrderHistoryClientInterface>> => {
  return fetcher('/api/order-history-clients', {}, query);
};

export const createOrderHistoryClient = async (orderHistoryClient: OrderHistoryClientInterface) => {
  return fetcher('/api/order-history-clients', { method: 'POST', body: JSON.stringify(orderHistoryClient) });
};

export const updateOrderHistoryClientById = async (id: string, orderHistoryClient: OrderHistoryClientInterface) => {
  return fetcher(`/api/order-history-clients/${id}`, { method: 'PUT', body: JSON.stringify(orderHistoryClient) });
};

export const getOrderHistoryClientById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/order-history-clients/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteOrderHistoryClientById = async (id: string) => {
  return fetcher(`/api/order-history-clients/${id}`, { method: 'DELETE' });
};
