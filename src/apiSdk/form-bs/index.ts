import queryString from 'query-string';
import { FormBInterface, FormBGetQueryInterface } from 'interfaces/form-b';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getFormBS = async (query?: FormBGetQueryInterface): Promise<PaginatedInterface<FormBInterface>> => {
  return fetcher('/api/form-bs', {}, query);
};

export const createFormB = async (formB: FormBInterface) => {
  return fetcher('/api/form-bs', { method: 'POST', body: JSON.stringify(formB) });
};

export const updateFormBById = async (id: string, formB: FormBInterface) => {
  return fetcher(`/api/form-bs/${id}`, { method: 'PUT', body: JSON.stringify(formB) });
};

export const getFormBById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/form-bs/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteFormBById = async (id: string) => {
  return fetcher(`/api/form-bs/${id}`, { method: 'DELETE' });
};
