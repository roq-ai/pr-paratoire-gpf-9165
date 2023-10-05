import queryString from 'query-string';
import { ClientProfileInterface, ClientProfileGetQueryInterface } from 'interfaces/client-profile';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getClientProfiles = async (
  query?: ClientProfileGetQueryInterface,
): Promise<PaginatedInterface<ClientProfileInterface>> => {
  return fetcher('/api/client-profiles', {}, query);
};

export const createClientProfile = async (clientProfile: ClientProfileInterface) => {
  return fetcher('/api/client-profiles', { method: 'POST', body: JSON.stringify(clientProfile) });
};

export const updateClientProfileById = async (id: string, clientProfile: ClientProfileInterface) => {
  return fetcher(`/api/client-profiles/${id}`, { method: 'PUT', body: JSON.stringify(clientProfile) });
};

export const getClientProfileById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/client-profiles/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteClientProfileById = async (id: string) => {
  return fetcher(`/api/client-profiles/${id}`, { method: 'DELETE' });
};
