import { Box, Center, Flex, Link, List, ListItem, Spinner, Stack, Text, Image, Button } from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import { Error } from 'components/error';
import { FormListItem } from 'components/form-list-item';
import { FormWrapper } from 'components/form-wrapper';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { routes } from 'routes';
import useSWR from 'swr';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { UserPageTable } from 'components/user-page-table';
import { EntityImage } from 'components/entity-image';
import { FiEdit2 } from 'react-icons/fi';

import { getOrderHistoryPharmacieById } from 'apiSdk/order-history-pharmacies';
import { OrderHistoryPharmacieInterface } from 'interfaces/order-history-pharmacie';

function OrderHistoryPharmacieViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OrderHistoryPharmacieInterface>(
    () => (id ? `/order-history-pharmacies/${id}` : null),
    () =>
      getOrderHistoryPharmacieById(id, {
        relations: [
          'user',
          'client_profile',
          'order_current_order_history_pharmacie_order_idToorder_current',
          'order_current_order_history_pharmacie_order_statutToorder_current',
          'order_current_order_history_pharmacie_order_created_atToorder_current',
          'order_current_order_history_pharmacie_total_priceToorder_current',
        ],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

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
              label: 'Order History Pharmacie Details',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormWrapper wrapperProps={{ border: 'none', gap: 3, p: 0 }}>
              <Flex alignItems="center" w="full" justifyContent={'space-between'}>
                <Box>
                  <Text
                    sx={{
                      fontSize: '1.875rem',
                      fontWeight: 700,
                      color: 'base.content',
                    }}
                  >
                    Order History Pharmacie Details
                  </Text>
                </Box>
                {hasAccess('order_history_pharmacie', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                  <NextLink href={`/order-history-pharmacies/edit/${id}`} passHref legacyBehavior>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      mr={2}
                      padding="0rem 0.5rem"
                      height="24px"
                      fontSize="0.75rem"
                      variant="outline"
                      color="state.info.main"
                      borderRadius="6px"
                      border="1px"
                      borderColor="state.info.transparent"
                      leftIcon={<FiEdit2 width="12px" height="12px" color="state.info.main" />}
                    >
                      Edit
                    </Button>
                  </NextLink>
                )}
              </Flex>

              <List
                w="100%"
                css={{
                  '> li:not(:last-child)': {
                    borderBottom: '1px solid var(--chakra-colors-base-300)',
                  },
                }}
              >
                <FormListItem
                  label="Created At"
                  text={data?.created_at ? format(parseISO(data?.created_at as unknown as string), 'dd-MM-yyyy') : ''}
                />

                <FormListItem
                  label="Updated At"
                  text={data?.updated_at ? format(parseISO(data?.updated_at as unknown as string), 'dd-MM-yyyy') : ''}
                />

                {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="User"
                    text={
                      <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                        {data?.user?.email}
                      </Link>
                    }
                  />
                )}
                {hasAccess('client_profile', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Client Profile"
                    text={
                      <Link as={NextLink} href={`/client-profiles/view/${data?.client_profile?.id}`}>
                        {data?.client_profile?.name_pharmacy}
                      </Link>
                    }
                  />
                )}
                {hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Order Current Order History Pharmacie Order Id Toorder Current"
                    text={
                      <Link
                        as={NextLink}
                        href={`/order-currents/view/${data?.order_current_order_history_pharmacie_order_idToorder_current?.id}`}
                      >
                        {data?.order_current_order_history_pharmacie_order_idToorder_current?.form_a_pdf_path}
                      </Link>
                    }
                  />
                )}
                {hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Order Current Order History Pharmacie Order Statut Toorder Current"
                    text={
                      <Link
                        as={NextLink}
                        href={`/order-currents/view/${data?.order_current_order_history_pharmacie_order_statutToorder_current?.id}`}
                      >
                        {data?.order_current_order_history_pharmacie_order_statutToorder_current?.form_a_pdf_path}
                      </Link>
                    }
                  />
                )}
                {hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Order Current Order History Pharmacie Order Created At Toorder Current"
                    text={
                      <Link
                        as={NextLink}
                        href={`/order-currents/view/${data?.order_current_order_history_pharmacie_order_created_atToorder_current?.id}`}
                      >
                        {data?.order_current_order_history_pharmacie_order_created_atToorder_current?.form_a_pdf_path}
                      </Link>
                    }
                  />
                )}
                {hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Order Current Order History Pharmacie Total Price Toorder Current"
                    text={
                      <Link
                        as={NextLink}
                        href={`/order-currents/view/${data?.order_current_order_history_pharmacie_total_priceToorder_current?.id}`}
                      >
                        {data?.order_current_order_history_pharmacie_total_priceToorder_current?.form_a_pdf_path}
                      </Link>
                    }
                  />
                )}
              </List>
            </FormWrapper>
          </>
        )}
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
    operation: AccessOperationEnum.READ,
  }),
)(OrderHistoryPharmacieViewPage);
