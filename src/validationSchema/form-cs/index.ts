import * as yup from 'yup';

export const formCValidationSchema = yup.object().shape({
  controle_elements_disponible: yup.boolean().required(),
  controle_pharmacotechniques: yup.boolean().required(),
  decision_liberation: yup.boolean().required(),
  user_id: yup.string().nullable().required(),
  name_pharmacy: yup.string().nullable().required(),
  order_id: yup.string().nullable().required(),
  name_patient: yup.string().nullable(),
});
