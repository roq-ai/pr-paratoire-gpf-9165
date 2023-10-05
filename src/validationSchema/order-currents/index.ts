import * as yup from 'yup';

export const orderCurrentValidationSchema = yup.object().shape({
  order_date: yup.date().required(),
  total_price: yup.number().required(),
  confirmation_order: yup.boolean().nullable(),
  delivery_order: yup.boolean().nullable(),
  form_a_pdf_path: yup.string().nullable(),
  form_b_pdf_path: yup.string().nullable(),
  form_c_pdf_path: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
  name_pharmacy: yup.string().nullable(),
  form_a_id: yup.string().nullable().required(),
  form_b_id: yup.string().nullable(),
  form_c_id: yup.string().nullable(),
});
