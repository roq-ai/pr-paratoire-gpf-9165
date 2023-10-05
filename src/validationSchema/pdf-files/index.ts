import * as yup from 'yup';

export const pdfFileValidationSchema = yup.object().shape({
  file_name: yup.string().required(),
  associated_form: yup.string().nullable().required(),
});
