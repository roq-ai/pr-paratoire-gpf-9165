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
import { getFormCById, updateFormCById } from 'apiSdk/form-cs';
import { formCValidationSchema } from 'validationSchema/form-cs';
import { FormCInterface } from 'interfaces/form-c';
import { UserInterface } from 'interfaces/user';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { OrderCurrentInterface } from 'interfaces/order-current';
import { FormAInterface } from 'interfaces/form-a';
import { getUsers } from 'apiSdk/users';
import { getClientProfiles } from 'apiSdk/client-profiles';
import { getOrderCurrents } from 'apiSdk/order-currents';
import { getFormAS } from 'apiSdk/form-as';

function FormCEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<FormCInterface>(
    () => (id ? `/form-cs/${id}` : null),
    () => getFormCById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FormCInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFormCById(id, values);
      mutate(updated);
      resetForm();
      router.push('/form-cs');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<FormCInterface>({
    initialValues: data,
    validationSchema: formCValidationSchema,
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
              label: 'Form CS',
              link: '/form-cs',
            },
            {
              label: 'Update Form C',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Form C
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl
            id="controle_elements_disponible"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.controle_elements_disponible}
          >
            <FormLabel htmlFor="switch-controle_elements_disponible">Controle Elements Disponible</FormLabel>
            <Switch
              id="switch-controle_elements_disponible"
              name="controle_elements_disponible"
              onChange={formik.handleChange}
              value={formik.values?.controle_elements_disponible ? 1 : 0}
            />
            {formik.errors?.controle_elements_disponible && (
              <FormErrorMessage>{formik.errors?.controle_elements_disponible}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            id="controle_pharmacotechniques"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.controle_pharmacotechniques}
          >
            <FormLabel htmlFor="switch-controle_pharmacotechniques">Controle Pharmacotechniques</FormLabel>
            <Switch
              id="switch-controle_pharmacotechniques"
              name="controle_pharmacotechniques"
              onChange={formik.handleChange}
              value={formik.values?.controle_pharmacotechniques ? 1 : 0}
            />
            {formik.errors?.controle_pharmacotechniques && (
              <FormErrorMessage>{formik.errors?.controle_pharmacotechniques}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            id="decision_liberation"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.decision_liberation}
          >
            <FormLabel htmlFor="switch-decision_liberation">Decision Liberation</FormLabel>
            <Switch
              id="switch-decision_liberation"
              name="decision_liberation"
              onChange={formik.handleChange}
              value={formik.values?.decision_liberation ? 1 : 0}
            />
            {formik.errors?.decision_liberation && (
              <FormErrorMessage>{formik.errors?.decision_liberation}</FormErrorMessage>
            )}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<ClientProfileInterface>
            formik={formik}
            name={'name_pharmacy'}
            label={'Select Client Profile'}
            placeholder={'Select Client Profile'}
            fetcher={getClientProfiles}
            labelField={'name_pharmacy'}
          />
          <AsyncSelect<OrderCurrentInterface>
            formik={formik}
            name={'order_id'}
            label={'Select Order Current'}
            placeholder={'Select Order Current'}
            fetcher={getOrderCurrents}
            labelField={'form_a_pdf_path'}
          />
          <AsyncSelect<FormAInterface>
            formik={formik}
            name={'name_patient'}
            label={'Select Form A'}
            placeholder={'Select Form A'}
            fetcher={getFormAS}
            labelField={'sex'}
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
              onClick={() => router.push('/form-cs')}
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
    entity: 'form_c',
    operation: AccessOperationEnum.UPDATE,
  }),
)(FormCEditPage);
