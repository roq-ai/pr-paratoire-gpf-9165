import queryString from 'query-string';
import { FormCInterface, FormCGetQueryInterface } from 'interfaces/form-c';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getFormCS = async (query?: FormCGetQueryInterface): Promise<PaginatedInterface<FormCInterface>> => {
  return fetcher('/api/form-cs', {}, query);
};

export const createFormC = async (formC: FormCInterface) => {
  return fetcher('/api/form-cs', { method: 'POST', body: JSON.stringify(formC) });
};

export const updateFormCById = async (id: string, formC: FormCInterface) => {
  return fetcher(`/api/form-cs/${id}`, { method: 'PUT', body: JSON.stringify(formC) });
};

export const getFormCById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/form-cs/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteFormCById = async (id: string) => {
  return fetcher(`/api/form-cs/${id}`, { method: 'DELETE' });
};
