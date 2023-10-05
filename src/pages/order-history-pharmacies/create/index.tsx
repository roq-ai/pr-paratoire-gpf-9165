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

import { createOrderHistoryPharmacie } from 'apiSdk/order-history-pharmacies';
import { orderHistoryPharmacieValidationSchema } from 'validationSchema/order-history-pharmacies';
import { UserInterface } from 'interfaces/user';
import { ClientProfileInterface } from 'interfaces/client-profile';
import { OrderCurrentInterface } from 'interfaces/order-current';
import { getUsers } from 'apiSdk/users';
import { getClientProfiles } from 'apiSdk/client-profiles';
import { getOrderCurrents } from 'apiSdk/order-currents';
import { OrderHistoryPharmacieInterface } from 'interfaces/order-history-pharmacie';

function OrderHistoryPharmacieCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OrderHistoryPharmacieInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOrderHistoryPharmacie(values);
      resetForm();
      router.push('/order-history-pharmacies');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OrderHistoryPharmacieInterface>({
    initialValues: {
      user_id: (router.query.user_id as string) ?? null,
      name_pharmacy: (router.query.name_pharmacy as string) ?? null,
      order_id: (router.query.order_id as string) ?? null,
      order_statut: (router.query.order_statut as string) ?? null,
      order_created_at: (router.query.order_created_at as string) ?? null,
      total_price: (router.query.total_price as string) ?? null,
    },
    validationSchema: orderHistoryPharmacieValidationSchema,
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
              label: 'Order History Pharmacies',
              link: '/order-history-pharmacies',
            },
            {
              label: 'Create Order History Pharmacie',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Order History Pharmacie
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
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
          <AsyncSelect<OrderCurrentInterface>
            formik={formik}
            name={'order_statut'}
            label={'Select Order Current'}
            placeholder={'Select Order Current'}
            fetcher={getOrderCurrents}
            labelField={'form_a_pdf_path'}
          />
          <AsyncSelect<OrderCurrentInterface>
            formik={formik}
            name={'order_created_at'}
            label={'Select Order Current'}
            placeholder={'Select Order Current'}
            fetcher={getOrderCurrents}
            labelField={'form_a_pdf_path'}
          />
          <AsyncSelect<OrderCurrentInterface>
            formik={formik}
            name={'total_price'}
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
              onClick={() => router.push('/order-history-pharmacies')}
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
    entity: 'order_history_pharmacie',
    operation: AccessOperationEnum.CREATE,
  }),
)(OrderHistoryPharmacieCreatePage);
