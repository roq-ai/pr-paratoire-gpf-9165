import * as yup from 'yup';

export const formBValidationSchema = yup.object().shape({
  submission_date: yup.date().required(),
  forme_pharmaceutique: yup.boolean().required(),
  modalite_d_administration: yup.string().required(),
  decision_sous_traiter_preparation: yup.boolean().required(),
  decision_realiser_preparation: yup.boolean().required(),
  name_pharmacy: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
  name_patient: yup.string().nullable(),
  sex: yup.string().nullable(),
  order_id: yup.string().nullable().required(),
});
