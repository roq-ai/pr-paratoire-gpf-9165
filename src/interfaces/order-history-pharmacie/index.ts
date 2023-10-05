import { UserInterface } from 'interfaces/user';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { OrderCurrentInterface } from 'interfaces/order-current';
import { GetQueryInterface } from 'interfaces';

export interface OrderHistoryPharmacieInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  user_id?: string;
  name_pharmacy: string;
  order_id: string;
  order_statut: string;
  order_created_at: string;
  total_price?: string;

  user?: UserInterface;
  client_profile?: ClientProfileInterface;
  order_current_order_history_pharmacie_order_idToorder_current?: OrderCurrentInterface;
  order_current_order_history_pharmacie_order_statutToorder_current?: OrderCurrentInterface;
  order_current_order_history_pharmacie_order_created_atToorder_current?: OrderCurrentInterface;
  order_current_order_history_pharmacie_total_priceToorder_current?: OrderCurrentInterface;
  _count?: {};
}

export interface OrderHistoryPharmacieGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  name_pharmacy?: string;
  order_id?: string;
  order_statut?: string;
  order_created_at?: string;
  total_price?: string;
}
