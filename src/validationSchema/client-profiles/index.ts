import * as yup from 'yup';

export const clientProfileValidationSchema = yup.object().shape({
  name_pharmacy: yup.string().required(),
  user_id: yup.string().nullable().required(),
});
