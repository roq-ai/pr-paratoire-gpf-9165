import { OrderCurrentInterface } from 'interfaces/order-current';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { UserInterface } from 'interfaces/user';
import { FormAInterface } from 'interfaces/form-a';
import { GetQueryInterface } from 'interfaces';

export interface FormBInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  name_pharmacy: string;
  user_id: string;
  name_patient?: string;
  sex?: string;
  submission_date: any;
  forme_pharmaceutique: boolean;
  modalite_d_administration: string;
  decision_sous_traiter_preparation: boolean;
  order_id: string;
  decision_realiser_preparation: boolean;
  order_current_order_current_form_b_idToform_b?: OrderCurrentInterface[];
  client_profile?: ClientProfileInterface;
  user?: UserInterface;
  form_a_form_b_name_patientToform_a?: FormAInterface;
  form_a_form_b_sexToform_a?: FormAInterface;
  order_current_form_b_order_idToorder_current?: OrderCurrentInterface;
  _count?: {
    order_current_order_current_form_b_idToform_b?: number;
  };
}

export interface FormBGetQueryInterface extends GetQueryInterface {
  id?: string;
  name_pharmacy?: string;
  user_id?: string;
  name_patient?: string;
  sex?: string;
  modalite_d_administration?: string;
  order_id?: string;
}
