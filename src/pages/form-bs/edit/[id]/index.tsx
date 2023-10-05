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
import { getFormBById, updateFormBById } from 'apiSdk/form-bs';
import { formBValidationSchema } from 'validationSchema/form-bs';
import { FormBInterface } from 'interfaces/form-b';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { UserInterface } from 'interfaces/user';
import { FormAInterface } from 'interfaces/form-a';
import { OrderCurrentInterface } from 'interfaces/order-current';
import { getClientProfiles } from 'apiSdk/client-profiles';
import { getUsers } from 'apiSdk/users';
import { getFormAS } from 'apiSdk/form-as';
import { getOrderCurrents } from 'apiSdk/order-currents';

function FormBEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<FormBInterface>(
    () => (id ? `/form-bs/${id}` : null),
    () => getFormBById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FormBInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFormBById(id, values);
      mutate(updated);
      resetForm();
      router.push('/form-bs');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<FormBInterface>({
    initialValues: data,
    validationSchema: formBValidationSchema,
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
              label: 'Form BS',
              link: '/form-bs',
            },
            {
              label: 'Update Form B',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Form B
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

          <FormControl
            id="forme_pharmaceutique"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.forme_pharmaceutique}
          >
            <FormLabel htmlFor="switch-forme_pharmaceutique">Forme Pharmaceutique</FormLabel>
            <Switch
              id="switch-forme_pharmaceutique"
              name="forme_pharmaceutique"
              onChange={formik.handleChange}
              value={formik.values?.forme_pharmaceutique ? 1 : 0}
            />
            {formik.errors?.forme_pharmaceutique && (
              <FormErrorMessage>{formik.errors?.forme_pharmaceutique}</FormErrorMessage>
            )}
          </FormControl>

          <TextInput
            error={formik.errors.modalite_d_administration}
            label={'Modalite D Administration'}
            props={{
              name: 'modalite_d_administration',
              placeholder: 'Modalite D Administration',
              value: formik.values?.modalite_d_administration,
              onChange: formik.handleChange,
            }}
          />

          <FormControl
            id="decision_sous_traiter_preparation"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.decision_sous_traiter_preparation}
          >
            <FormLabel htmlFor="switch-decision_sous_traiter_preparation">Decision Sous Traiter Preparation</FormLabel>
            <Switch
              id="switch-decision_sous_traiter_preparation"
              name="decision_sous_traiter_preparation"
              onChange={formik.handleChange}
              value={formik.values?.decision_sous_traiter_preparation ? 1 : 0}
            />
            {formik.errors?.decision_sous_traiter_preparation && (
              <FormErrorMessage>{formik.errors?.decision_sous_traiter_preparation}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            id="decision_realiser_preparation"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.decision_realiser_preparation}
          >
            <FormLabel htmlFor="switch-decision_realiser_preparation">Decision Realiser Preparation</FormLabel>
            <Switch
              id="switch-decision_realiser_preparation"
              name="decision_realiser_preparation"
              onChange={formik.handleChange}
              value={formik.values?.decision_realiser_preparation ? 1 : 0}
            />
            {formik.errors?.decision_realiser_preparation && (
              <FormErrorMessage>{formik.errors?.decision_realiser_preparation}</FormErrorMessage>
            )}
          </FormControl>
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
          <AsyncSelect<FormAInterface>
            formik={formik}
            name={'name_patient'}
            label={'Select Form A'}
            placeholder={'Select Form A'}
            fetcher={getFormAS}
            labelField={'sex'}
          />
          <AsyncSelect<FormAInterface>
            formik={formik}
            name={'sex'}
            label={'Select Form A'}
            placeholder={'Select Form A'}
            fetcher={getFormAS}
            labelField={'sex'}
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
              onClick={() => router.push('/form-bs')}
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
    entity: 'form_b',
    operation: AccessOperationEnum.UPDATE,
  }),
)(FormBEditPage);
