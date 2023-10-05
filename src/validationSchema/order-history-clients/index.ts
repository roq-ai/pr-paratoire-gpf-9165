import * as yup from 'yup';

export const orderHistoryClientValidationSchema = yup.object().shape({
  order_id: yup.string().nullable().required(),
  order_statut: yup.string().nullable().required(),
  order_created_at: yup.string().nullable().required(),
  name_patient: yup.string().nullable(),
  total_price: yup.string().nullable(),
});
