import { FormBInterface } from 'interfaces/form-b';
import { FormCInterface } from 'interfaces/form-c';
import { OrderCurrentInterface } from 'interfaces/order-current';
import { OrderHistoryPharmacieInterface } from 'interfaces/order-history-pharmacie';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ClientProfileInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  name_pharmacy: string;
  form_b?: FormBInterface[];
  form_c?: FormCInterface[];
  order_current?: OrderCurrentInterface[];
  order_history_pharmacie?: OrderHistoryPharmacieInterface[];
  user?: UserInterface;
  _count?: {
    form_b?: number;
    form_c?: number;
    order_current?: number;
    order_history_pharmacie?: number;
  };
}

export interface ClientProfileGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  name_pharmacy?: string;
}
