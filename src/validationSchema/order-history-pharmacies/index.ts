import * as yup from 'yup';

export const orderHistoryPharmacieValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
  name_pharmacy: yup.string().nullable().required(),
  order_id: yup.string().nullable().required(),
  order_statut: yup.string().nullable().required(),
  order_created_at: yup.string().nullable().required(),
  total_price: yup.string().nullable(),
});
