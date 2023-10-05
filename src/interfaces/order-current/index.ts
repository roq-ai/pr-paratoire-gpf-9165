import { FormAInterface } from 'interfaces/form-a';
import { FormBInterface } from 'interfaces/form-b';
import { FormCInterface } from 'interfaces/form-c';
import { OrderHistoryClientInterface } from 'interfaces/order-history-client';
import { OrderHistoryPharmacieInterface } from 'interfaces/order-history-pharmacie';
import { UserInterface } from 'interfaces/user';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { GetQueryInterface } from 'interfaces';

export interface OrderCurrentInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  order_date?: any;
  total_price: number;
  user_id: string;
  name_pharmacy?: string;
  form_a_id: string;
  form_b_id?: string;
  confirmation_order?: boolean;
  form_c_id?: string;
  delivery_order?: boolean;
  form_a_pdf_path?: string;
  form_b_pdf_path?: string;
  form_c_pdf_path?: string;
  form_a_form_a_order_idToorder_current?: FormAInterface[];
  form_b_form_b_order_idToorder_current?: FormBInterface[];
  form_c_form_c_order_idToorder_current?: FormCInterface[];
  order_history_client_order_history_client_order_created_atToorder_current?: OrderHistoryClientInterface[];
  order_history_client_order_history_client_order_idToorder_current?: OrderHistoryClientInterface[];
  order_history_client_order_history_client_order_statutToorder_current?: OrderHistoryClientInterface[];
  order_history_client_order_history_client_total_priceToorder_current?: OrderHistoryClientInterface[];
  order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current?: OrderHistoryPharmacieInterface[];
  order_history_pharmacie_order_history_pharmacie_order_idToorder_current?: OrderHistoryPharmacieInterface[];
  order_history_pharmacie_order_history_pharmacie_order_statutToorder_current?: OrderHistoryPharmacieInterface[];
  order_history_pharmacie_order_history_pharmacie_total_priceToorder_current?: OrderHistoryPharmacieInterface[];
  user?: UserInterface;
  client_profile?: ClientProfileInterface;
  form_a_order_current_form_a_idToform_a?: FormAInterface;
  form_b_order_current_form_b_idToform_b?: FormBInterface;
  form_c_order_current_form_c_idToform_c?: FormCInterface;
  _count?: {
    form_a_form_a_order_idToorder_current?: number;
    form_b_form_b_order_idToorder_current?: number;
    form_c_form_c_order_idToorder_current?: number;
    order_history_client_order_history_client_order_created_atToorder_current?: number;
    order_history_client_order_history_client_order_idToorder_current?: number;
    order_history_client_order_history_client_order_statutToorder_current?: number;
    order_history_client_order_history_client_total_priceToorder_current?: number;
    order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current?: number;
    order_history_pharmacie_order_history_pharmacie_order_idToorder_current?: number;
    order_history_pharmacie_order_history_pharmacie_order_statutToorder_current?: number;
    order_history_pharmacie_order_history_pharmacie_total_priceToorder_current?: number;
  };
}

export interface OrderCurrentGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  name_pharmacy?: string;
  form_a_id?: string;
  form_b_id?: string;
  form_c_id?: string;
  form_a_pdf_path?: string;
  form_b_pdf_path?: string;
  form_c_pdf_path?: string;
}
