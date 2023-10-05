import { OrderCurrentInterface } from 'interfaces/order-current';
import { UserInterface } from 'interfaces/user';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { FormAInterface } from 'interfaces/form-a';
import { GetQueryInterface } from 'interfaces';

export interface FormCInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  name_pharmacy: string;
  order_id: string;
  name_patient?: string;
  controle_elements_disponible: boolean;
  controle_pharmacotechniques: boolean;
  decision_liberation: boolean;
  order_current_order_current_form_c_idToform_c?: OrderCurrentInterface[];
  user?: UserInterface;
  client_profile?: ClientProfileInterface;
  order_current_form_c_order_idToorder_current?: OrderCurrentInterface;
  form_a?: FormAInterface;
  _count?: {
    order_current_order_current_form_c_idToform_c?: number;
  };
}

export interface FormCGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  name_pharmacy?: string;
  order_id?: string;
  name_patient?: string;
}
