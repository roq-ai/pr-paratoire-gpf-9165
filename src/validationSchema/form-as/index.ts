import * as yup from 'yup';

export const formAValidationSchema = yup.object().shape({
  submission_date: yup.date().required(),
  sex: yup.string().nullable(),
  name_patient: yup.string().nullable(),
  medication_details: yup.string().nullable(),
  name_pharmacy: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
  order_id: yup.string().nullable(),
});
