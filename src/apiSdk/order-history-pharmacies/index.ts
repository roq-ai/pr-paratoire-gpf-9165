import queryString from 'query-string';
import {
  OrderHistoryPharmacieInterface,
  OrderHistoryPharmacieGetQueryInterface,
} from 'interfaces/order-history-pharmacie';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getOrderHistoryPharmacies = async (
  query?: OrderHistoryPharmacieGetQueryInterface,
): Promise<PaginatedInterface<OrderHistoryPharmacieInterface>> => {
  return fetcher('/api/order-history-pharmacies', {}, query);
};

export const createOrderHistoryPharmacie = async (orderHistoryPharmacie: OrderHistoryPharmacieInterface) => {
  return fetcher('/api/order-history-pharmacies', { method: 'POST', body: JSON.stringify(orderHistoryPharmacie) });
};

export const updateOrderHistoryPharmacieById = async (
  id: string,
  orderHistoryPharmacie: OrderHistoryPharmacieInterface,
) => {
  return fetcher(`/api/order-history-pharmacies/${id}`, { method: 'PUT', body: JSON.stringify(orderHistoryPharmacie) });
};

export const getOrderHistoryPharmacieById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/order-history-pharmacies/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteOrderHistoryPharmacieById = async (id: string) => {
  return fetcher(`/api/order-history-pharmacies/${id}`, { method: 'DELETE' });
};
