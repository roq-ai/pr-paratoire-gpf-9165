import { FormBInterface } from 'interfaces/form-b';
import { FormCInterface } from 'interfaces/form-c';
import { OrderCurrentInterface } from 'interfaces/order-current';
import { OrderHistoryClientInterface } from 'interfaces/order-history-client';
import { PdfFileInterface } from 'interfaces/pdf-file';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface FormAInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  name_pharmacy: string;
  user_id: string;
  submission_date: any;
  order_id?: string;
  sex?: string;
  name_patient?: string;
  medication_details?: string;
  form_b_form_b_name_patientToform_a?: FormBInterface[];
  form_b_form_b_sexToform_a?: FormBInterface[];
  form_c?: FormCInterface[];
  order_current_order_current_form_a_idToform_a?: OrderCurrentInterface[];
  order_history_client?: OrderHistoryClientInterface[];
  pdf_file?: PdfFileInterface[];
  client_profile?: ClientProfileInterface;
  user?: UserInterface;
  order_current_form_a_order_idToorder_current?: OrderCurrentInterface;
  _count?: {
    form_b_form_b_name_patientToform_a?: number;
    form_b_form_b_sexToform_a?: number;
    form_c?: number;
    order_current_order_current_form_a_idToform_a?: number;
    order_history_client?: number;
    pdf_file?: number;
  };
}

export interface FormAGetQueryInterface extends GetQueryInterface {
  id?: string;
  name_pharmacy?: string;
  user_id?: string;
  order_id?: string;
  sex?: string;
  name_patient?: string;
  medication_details?: string;
}
