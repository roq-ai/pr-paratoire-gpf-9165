import queryString from 'query-string';
import { FormAInterface, FormAGetQueryInterface } from 'interfaces/form-a';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getFormAS = async (query?: FormAGetQueryInterface): Promise<PaginatedInterface<FormAInterface>> => {
  return fetcher('/api/form-as', {}, query);
};

export const createFormA = async (formA: FormAInterface) => {
  return fetcher('/api/form-as', { method: 'POST', body: JSON.stringify(formA) });
};

export const updateFormAById = async (id: string, formA: FormAInterface) => {
  return fetcher(`/api/form-as/${id}`, { method: 'PUT', body: JSON.stringify(formA) });
};

export const getFormAById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/form-as/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteFormAById = async (id: string) => {
  return fetcher(`/api/form-as/${id}`, { method: 'DELETE' });
};
