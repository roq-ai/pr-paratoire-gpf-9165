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

import { createOrderHistoryClient } from 'apiSdk/order-history-clients';
import { orderHistoryClientValidationSchema } from 'validationSchema/order-history-clients';
import { OrderCurrentInterface } from 'interfaces/order-current';
import { FormAInterface } from 'interfaces/form-a';
import { getOrderCurrents } from 'apiSdk/order-currents';
import { getFormAS } from 'apiSdk/form-as';
import { OrderHistoryClientInterface } from 'interfaces/order-history-client';

function OrderHistoryClientCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OrderHistoryClientInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOrderHistoryClient(values);
      resetForm();
      router.push('/order-history-clients');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OrderHistoryClientInterface>({
    initialValues: {
      order_id: (router.query.order_id as string) ?? null,
      order_statut: (router.query.order_statut as string) ?? null,
      order_created_at: (router.query.order_created_at as string) ?? null,
      name_patient: (router.query.name_patient as string) ?? null,
      total_price: (router.query.total_price as string) ?? null,
    },
    validationSchema: orderHistoryClientValidationSchema,
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
              label: 'Order History Clients',
              link: '/order-history-clients',
            },
            {
              label: 'Create Order History Client',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Order History Client
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
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
          <AsyncSelect<FormAInterface>
            formik={formik}
            name={'name_patient'}
            label={'Select Form A'}
            placeholder={'Select Form A'}
            fetcher={getFormAS}
            labelField={'sex'}
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
              onClick={() => router.push('/order-history-clients')}
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
    entity: 'order_history_client',
    operation: AccessOperationEnum.CREATE,
  }),
)(OrderHistoryClientCreatePage);
