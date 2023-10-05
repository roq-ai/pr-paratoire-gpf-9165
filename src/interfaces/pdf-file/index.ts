import { FormAInterface } from 'interfaces/form-a';
import { GetQueryInterface } from 'interfaces';

export interface PdfFileInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  file_name: string;
  associated_form: string;

  form_a?: FormAInterface;
  _count?: {};
}

export interface PdfFileGetQueryInterface extends GetQueryInterface {
  id?: string;
  file_name?: string;
  associated_form?: string;
}
