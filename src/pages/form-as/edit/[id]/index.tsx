import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getFormAById, updateFormAById } from 'apiSdk/form-as';
import { formAValidationSchema } from 'validationSchema/form-as';
import { FormAInterface } from 'interfaces/form-a';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { UserInterface } from 'interfaces/user';
import { OrderCurrentInterface } from 'interfaces/order-current';
import { getClientProfiles } from 'apiSdk/client-profiles';
import { getUsers } from 'apiSdk/users';
import { getOrderCurrents } from 'apiSdk/order-currents';

function FormAEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<FormAInterface>(
    () => (id ? `/form-as/${id}` : null),
    () => getFormAById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FormAInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFormAById(id, values);
      mutate(updated);
      resetForm();
      router.push('/form-as');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<FormAInterface>({
    initialValues: data,
    validationSchema: formAValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Form AS',
              link: '/form-as',
            },
            {
              label: 'Update Form A',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Form A
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="submission_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Submission Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.submission_date ? new Date(formik.values?.submission_date) : null}
              onChange={(value: Date) => formik.setFieldValue('submission_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.sex}
            label={'Sex'}
            props={{
              name: 'sex',
              placeholder: 'Sex',
              value: formik.values?.sex,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.name_patient}
            label={'Name Patient'}
            props={{
              name: 'name_patient',
              placeholder: 'Name Patient',
              value: formik.values?.name_patient,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.medication_details}
            label={'Medication Details'}
            props={{
              name: 'medication_details',
              placeholder: 'Medication Details',
              value: formik.values?.medication_details,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<ClientProfileInterface>
            formik={formik}
            name={'name_pharmacy'}
            label={'Select Client Profile'}
            placeholder={'Select Client Profile'}
            fetcher={getClientProfiles}
            labelField={'name_pharmacy'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<OrderCurrentInterface>
            formik={formik}
            name={'order_id'}
            label={'Select Order Current'}
            placeholder={'Select Order Current'}
            fetcher={getOrderCurrents}
            labelField={'form_a_pdf_path'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/form-as')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'form_a',
    operation: AccessOperationEnum.UPDATE,
  }),
)(FormAEditPage);
