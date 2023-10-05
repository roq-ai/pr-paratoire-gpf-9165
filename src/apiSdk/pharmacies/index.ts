import queryString from 'query-string';
import { PharmacyInterface, PharmacyGetQueryInterface } from 'interfaces/pharmacy';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPharmacies = async (
  query?: PharmacyGetQueryInterface,
): Promise<PaginatedInterface<PharmacyInterface>> => {
  return fetcher('/api/pharmacies', {}, query);
};

export const createPharmacy = async (pharmacy: PharmacyInterface) => {
  return fetcher('/api/pharmacies', { method: 'POST', body: JSON.stringify(pharmacy) });
};

export const updatePharmacyById = async (id: string, pharmacy: PharmacyInterface) => {
  return fetcher(`/api/pharmacies/${id}`, { method: 'PUT', body: JSON.stringify(pharmacy) });
};

export const getPharmacyById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/pharmacies/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deletePharmacyById = async (id: string) => {
  return fetcher(`/api/pharmacies/${id}`, { method: 'DELETE' });
};
