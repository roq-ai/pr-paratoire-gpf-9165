import queryString from 'query-string';
import { PdfFileInterface, PdfFileGetQueryInterface } from 'interfaces/pdf-file';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPdfFiles = async (query?: PdfFileGetQueryInterface): Promise<PaginatedInterface<PdfFileInterface>> => {
  return fetcher('/api/pdf-files', {}, query);
};

export const createPdfFile = async (pdfFile: PdfFileInterface) => {
  return fetcher('/api/pdf-files', { method: 'POST', body: JSON.stringify(pdfFile) });
};

export const updatePdfFileById = async (id: string, pdfFile: PdfFileInterface) => {
  return fetcher(`/api/pdf-files/${id}`, { method: 'PUT', body: JSON.stringify(pdfFile) });
};

export const getPdfFileById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/pdf-files/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deletePdfFileById = async (id: string) => {
  return fetcher(`/api/pdf-files/${id}`, { method: 'DELETE' });
};
