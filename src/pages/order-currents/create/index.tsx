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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createOrderCurrent } from 'apiSdk/order-currents';
import { orderCurrentValidationSchema } from 'validationSchema/order-currents';
import { UserInterface } from 'interfaces/user';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { FormAInterface } from 'interfaces/form-a';
import { FormBInterface } from 'interfaces/form-b';
import { FormCInterface } from 'interfaces/form-c';
import { getUsers } from 'apiSdk/users';
import { getClientProfiles } from 'apiSdk/client-profiles';
import { getFormAS } from 'apiSdk/form-as';
import { getFormBS } from 'apiSdk/form-bs';
import { getFormCS } from 'apiSdk/form-cs';
import { OrderCurrentInterface } from 'interfaces/order-current';

function OrderCurrentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OrderCurrentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOrderCurrent(values);
      resetForm();
      router.push('/order-currents');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OrderCurrentInterface>({
    initialValues: {
      order_date: new Date(new Date().toDateString()),
      total_price: 0,
      confirmation_order: false,
      delivery_order: false,
      form_a_pdf_path: '',
      form_b_pdf_path: '',
      form_c_pdf_path: '',
      user_id: (router.query.user_id as string) ?? null,
      name_pharmacy: (router.query.name_pharmacy as string) ?? null,
      form_a_id: (router.query.form_a_id as string) ?? null,
      form_b_id: (router.query.form_b_id as string) ?? null,
      form_c_id: (router.query.form_c_id as string) ?? null,
    },
    validationSchema: orderCurrentValidationSchema,
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
              label: 'Order Currents',
              link: '/order-currents',
            },
            {
              label: 'Create Order Current',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Order Current
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="order_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Order Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.order_date ? new Date(formik.values?.order_date) : null}
              onChange={(value: Date) => formik.setFieldValue('order_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Total Price"
            formControlProps={{
              id: 'total_price',
              isInvalid: !!formik.errors?.total_price,
            }}
            name="total_price"
            error={formik.errors?.total_price}
            value={formik.values?.total_price}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl
            id="confirmation_order"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.confirmation_order}
          >
            <FormLabel htmlFor="switch-confirmation_order">Confirmation Order</FormLabel>
            <Switch
              id="switch-confirmation_order"
              name="confirmation_order"
              onChange={formik.handleChange}
              value={formik.values?.confirmation_order ? 1 : 0}
            />
            {formik.errors?.confirmation_order && (
              <FormErrorMessage>{formik.errors?.confirmation_order}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            id="delivery_order"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.delivery_order}
          >
            <FormLabel htmlFor="switch-delivery_order">Delivery Order</FormLabel>
            <Switch
              id="switch-delivery_order"
              name="delivery_order"
              onChange={formik.handleChange}
              value={formik.values?.delivery_order ? 1 : 0}
            />
            {formik.errors?.delivery_order && <FormErrorMessage>{formik.errors?.delivery_order}</FormErrorMessage>}
          </FormControl>

          <TextInput
            error={formik.errors.form_a_pdf_path}
            label={'Form A Pdf Path'}
            props={{
              name: 'form_a_pdf_path',
              placeholder: 'Form A Pdf Path',
              value: formik.values?.form_a_pdf_path,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.form_b_pdf_path}
            label={'Form B Pdf Path'}
            props={{
              name: 'form_b_pdf_path',
              placeholder: 'Form B Pdf Path',
              value: formik.values?.form_b_pdf_path,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.form_c_pdf_path}
            label={'Form C Pdf Path'}
            props={{
              name: 'form_c_pdf_path',
              placeholder: 'Form C Pdf Path',
              value: formik.values?.form_c_pdf_path,
              onChange: formik.handleChange,
            }}
          />

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
          <AsyncSelect<FormAInterface>
            formik={formik}
            name={'form_a_id'}
            label={'Select Form A'}
            placeholder={'Select Form A'}
            fetcher={getFormAS}
            labelField={'sex'}
          />
          <AsyncSelect<FormBInterface>
            formik={formik}
            name={'form_b_id'}
            label={'Select Form B'}
            placeholder={'Select Form B'}
            fetcher={getFormBS}
            labelField={'modalite_d_administration'}
          />
          <AsyncSelect<FormCInterface>
            formik={formik}
            name={'form_c_id'}
            label={'Select Form C'}
            placeholder={'Select Form C'}
            fetcher={getFormCS}
            labelField={'controle_elements_disponible'}
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
              onClick={() => router.push('/order-currents')}
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
    entity: 'order_current',
    operation: AccessOperationEnum.CREATE,
  }),
)(OrderCurrentCreatePage);
