import { OrderCurrentInterface } from 'interfaces/order-current';
import { FormAInterface } from 'interfaces/form-a';
import { GetQueryInterface } from 'interfaces';

export interface OrderHistoryClientInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  order_id: string;
  order_statut: string;
  order_created_at: string;
  name_patient?: string;
  total_price?: string;

  order_current_order_history_client_order_idToorder_current?: OrderCurrentInterface;
  order_current_order_history_client_order_statutToorder_current?: OrderCurrentInterface;
  order_current_order_history_client_order_created_atToorder_current?: OrderCurrentInterface;
  form_a?: FormAInterface;
  order_current_order_history_client_total_priceToorder_current?: OrderCurrentInterface;
  _count?: {};
}

export interface OrderHistoryClientGetQueryInterface extends GetQueryInterface {
  id?: string;
  order_id?: string;
  order_statut?: string;
  order_created_at?: string;
  name_patient?: string;
  total_price?: string;
}
