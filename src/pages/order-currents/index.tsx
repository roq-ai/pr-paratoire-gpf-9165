import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
} from '@roq/nextjs';
import { compose } from 'lib/compose';
import { Box, Button, Flex, IconButton, Link, Text, TextProps } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { Error } from 'components/error';
import { SearchInput } from 'components/search-input';
import Table from 'components/table';
import { useDataTableParams, ListDataFiltersType } from 'components/table/hook/use-data-table-params.hook';
import { DATE_TIME_FORMAT } from 'const';
import d from 'dayjs';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash } from 'react-icons/fi';
import useSWR from 'swr';
import { PaginatedInterface } from 'interfaces';
import { withAppLayout } from 'lib/hocs/with-app-layout.hoc';
import { AccessInfo } from 'components/access-info';
import { getOrderCurrents, deleteOrderCurrentById } from 'apiSdk/order-currents';
import { OrderCurrentInterface } from 'interfaces/order-current';

type ColumnType = ColumnDef<OrderCurrentInterface, unknown>;

interface OrderCurrentListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
  tableOnly?: boolean;
  hideActions?: boolean;
}

export function OrderCurrentListPage(props: OrderCurrentListPageProps) {
  const {
    filters = {},
    titleProps = {},
    showSearchFilter = true,
    hidePagination,
    hideTableBorders,
    pageSize,
    tableOnly,
    hideActions,
  } = props;
  const { hasAccess } = useAuthorizationApi();
  const { onFiltersChange, onSearchTermChange, params, onPageChange, onPageSizeChange, setParams } = useDataTableParams(
    {
      filters,
      searchTerm: '',
      pageSize,
      order: [
        {
          desc: true,
          id: 'created_at',
        },
      ],
    },
  );

  const fetcher = useCallback(
    async () =>
      getOrderCurrents({
        relations: [
          'user',
          'client_profile',
          'form_a_order_current_form_a_idToform_a',
          'form_b_order_current_form_b_idToform_b',
          'form_c_order_current_form_c_idToform_c',
          'form_a_form_a_order_idToorder_current.count',
          'form_b_form_b_order_idToorder_current.count',
          'form_c_form_c_order_idToorder_current.count',
          'order_history_client_order_history_client_order_created_atToorder_current.count',
          'order_history_client_order_history_client_order_idToorder_current.count',
          'order_history_client_order_history_client_order_statutToorder_current.count',
          'order_history_client_order_history_client_total_priceToorder_current.count',
          'order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current.count',
          'order_history_pharmacie_order_history_pharmacie_order_idToorder_current.count',
          'order_history_pharmacie_order_history_pharmacie_order_statutToorder_current.count',
          'order_history_pharmacie_order_history_pharmacie_total_priceToorder_current.count',
        ],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: ['form_a_pdf_path.contains', 'form_b_pdf_path.contains', 'form_c_pdf_path.contains'],
        ...(params.filters || {}),
      }),
    [params.pageSize, params.pageNumber, params.searchTerm, params.order, params.filters],
  );

  const { data, error, isLoading, mutate } = useSWR<PaginatedInterface<OrderCurrentInterface>>(
    () => `/order-currents?params=${JSON.stringify(params)}`,
    fetcher,
  );

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteOrderCurrentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: OrderCurrentInterface) => {
    if (hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/order-currents/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    {
      id: 'order_date',
      header: 'Order Date',
      accessorKey: 'order_date',
      cell: ({ row: { original: record } }: any) =>
        record?.order_date ? format(parseISO(record?.order_date as unknown as string), 'dd-MM-yyyy') : '',
    },
    { id: 'total_price', header: 'Total Price', accessorKey: 'total_price' },
    { id: 'confirmation_order', header: 'Confirmation Order', accessorKey: 'confirmation_order' },
    { id: 'delivery_order', header: 'Delivery Order', accessorKey: 'delivery_order' },
    { id: 'form_a_pdf_path', header: 'Form A Pdf Path', accessorKey: 'form_a_pdf_path' },
    { id: 'form_b_pdf_path', header: 'Form B Pdf Path', accessorKey: 'form_b_pdf_path' },
    { id: 'form_c_pdf_path', header: 'Form C Pdf Path', accessorKey: 'form_c_pdf_path' },
    hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'user',
          header: 'User',
          accessorKey: 'user',
          cell: ({ row: { original: record } }: any) => (
            <Link as={NextLink} onClick={(e) => e.stopPropagation()} href={`/users/view/${record.user?.id}`}>
              {record.user?.email}
            </Link>
          ),
        }
      : null,
    hasAccess('client_profile', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'client_profile',
          header: 'Client Profile',
          accessorKey: 'client_profile',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/client-profiles/view/${record.client_profile?.id}`}
            >
              {record.client_profile?.name_pharmacy}
            </Link>
          ),
        }
      : null,
    hasAccess('form_a', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_a_order_current_form_a_idToform_a',
          header: 'Form A Order Current Form A Id Toform A',
          accessorKey: 'form_a_order_current_form_a_idToform_a',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/form-as/view/${record.form_a_order_current_form_a_idToform_a?.id}`}
            >
              {record.form_a_order_current_form_a_idToform_a?.sex}
            </Link>
          ),
        }
      : null,
    hasAccess('form_b', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_b_order_current_form_b_idToform_b',
          header: 'Form B Order Current Form B Id Toform B',
          accessorKey: 'form_b_order_current_form_b_idToform_b',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/form-bs/view/${record.form_b_order_current_form_b_idToform_b?.id}`}
            >
              {record.form_b_order_current_form_b_idToform_b?.modalite_d_administration}
            </Link>
          ),
        }
      : null,
    hasAccess('form_c', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_c_order_current_form_c_idToform_c',
          header: 'Form C Order Current Form C Id Toform C',
          accessorKey: 'form_c_order_current_form_c_idToform_c',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/form-cs/view/${record.form_c_order_current_form_c_idToform_c?.id}`}
            >
              {record.form_c_order_current_form_c_idToform_c?.controle_elements_disponible}
            </Link>
          ),
        }
      : null,
    hasAccess('form_a', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_a_form_a_order_idToorder_current',
          header: 'Form A Form A Order Id Toorder Current',
          accessorKey: 'form_a_form_a_order_idToorder_current',
          cell: ({ row: { original: record } }: any) => record?._count?.form_a_form_a_order_idToorder_current,
        }
      : null,
    hasAccess('form_b', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_b_form_b_order_idToorder_current',
          header: 'Form B Form B Order Id Toorder Current',
          accessorKey: 'form_b_form_b_order_idToorder_current',
          cell: ({ row: { original: record } }: any) => record?._count?.form_b_form_b_order_idToorder_current,
        }
      : null,
    hasAccess('form_c', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_c_form_c_order_idToorder_current',
          header: 'Form C Form C Order Id Toorder Current',
          accessorKey: 'form_c_form_c_order_idToorder_current',
          cell: ({ row: { original: record } }: any) => record?._count?.form_c_form_c_order_idToorder_current,
        }
      : null,
    hasAccess('order_history_client', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_client_order_history_client_order_created_atToorder_current',
          header: 'Order History Client Order History Client Order Created At Toorder Current',
          accessorKey: 'order_history_client_order_history_client_order_created_atToorder_current',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.order_history_client_order_history_client_order_created_atToorder_current,
        }
      : null,
    hasAccess('order_history_client', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_client_order_history_client_order_idToorder_current',
          header: 'Order History Client Order History Client Order Id Toorder Current',
          accessorKey: 'order_history_client_order_history_client_order_idToorder_current',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.order_history_client_order_history_client_order_idToorder_current,
        }
      : null,
    hasAccess('order_history_client', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_client_order_history_client_order_statutToorder_current',
          header: 'Order History Client Order History Client Order Statut Toorder Current',
          accessorKey: 'order_history_client_order_history_client_order_statutToorder_current',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.order_history_client_order_history_client_order_statutToorder_current,
        }
      : null,
    hasAccess('order_history_client', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_client_order_history_client_total_priceToorder_current',
          header: 'Order History Client Order History Client Total Price Toorder Current',
          accessorKey: 'order_history_client_order_history_client_total_priceToorder_current',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.order_history_client_order_history_client_total_priceToorder_current,
        }
      : null,
    hasAccess('order_history_pharmacie', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current',
          header: 'Order History Pharmacie Order History Pharmacie Order Created At Toorder Current',
          accessorKey: 'order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.order_history_pharmacie_order_history_pharmacie_order_created_atToorder_current,
        }
      : null,
    hasAccess('order_history_pharmacie', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_pharmacie_order_history_pharmacie_order_idToorder_current',
          header: 'Order History Pharmacie Order History Pharmacie Order Id Toorder Current',
          accessorKey: 'order_history_pharmacie_order_history_pharmacie_order_idToorder_current',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.order_history_pharmacie_order_history_pharmacie_order_idToorder_current,
        }
      : null,
    hasAccess('order_history_pharmacie', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_pharmacie_order_history_pharmacie_order_statutToorder_current',
          header: 'Order History Pharmacie Order History Pharmacie Order Statut Toorder Current',
          accessorKey: 'order_history_pharmacie_order_history_pharmacie_order_statutToorder_current',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.order_history_pharmacie_order_history_pharmacie_order_statutToorder_current,
        }
      : null,
    hasAccess('order_history_pharmacie', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_pharmacie_order_history_pharmacie_total_priceToorder_current',
          header: 'Order History Pharmacie Order History Pharmacie Total Price Toorder Current',
          accessorKey: 'order_history_pharmacie_order_history_pharmacie_total_priceToorder_current',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.order_history_pharmacie_order_history_pharmacie_total_priceToorder_current,
        }
      : null,

    !hideActions
      ? {
          id: 'actions',
          header: '',
          accessorKey: 'actions',
          cell: ({ row: { original: record } }: any) => (
            <Flex justifyContent="flex-end">
              <NextLink href={`/order-currents/view/${record.id}`} passHref legacyBehavior>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  mr={2}
                  padding="0rem 8px"
                  height="24px"
                  fontSize="0.75rem"
                  variant="solid"
                  backgroundColor="state.neutral.transparent"
                  color="state.neutral.main"
                  borderRadius="6px"
                >
                  View
                </Button>
              </NextLink>
              {hasAccess('order_current', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                <NextLink href={`/order-currents/edit/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('order_current', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(record.id);
                  }}
                  padding="0rem 0.5rem"
                  variant="outline"
                  aria-label="edit"
                  height={'24px'}
                  fontSize="0.75rem"
                  color="state.error.main"
                  borderRadius="6px"
                  borderColor="state.error.transparent"
                  icon={<FiTrash width="12px" height="12px" color="error.main" />}
                />
              )}
            </Flex>
          ),
        }
      : null,
  ].filter(Boolean) as ColumnType[];
  const table = (
    <Table
      hidePagination={hidePagination}
      hideTableBorders={hideTableBorders}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      columns={columns}
      data={data?.data}
      totalCount={data?.totalCount || 0}
      pageSize={params.pageSize}
      pageIndex={params.pageNumber}
      order={params.order}
      setParams={setParams}
      onRowClick={handleView}
    />
  );
  if (tableOnly) {
    return table;
  }

  return (
    <Flex direction="column" gap={{ md: 6, base: 7 }} shadow="none">
      <Flex justifyContent={{ md: 'space-between' }} direction={{ base: 'column', md: 'row' }} gap={{ base: '28px' }}>
        <Flex alignItems="center" gap={1}>
          <Text as="h1" fontSize="1.875rem" fontWeight="bold" color="base.content" {...titleProps}>
            Order Currents
          </Text>
          <AccessInfo entity="order_current" />
        </Flex>

        {hasAccess('order_current', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <NextLink href={`/order-currents/create`} passHref legacyBehavior>
            <Button
              onClick={(e) => e.stopPropagation()}
              height={'2rem'}
              padding="0rem 0.75rem"
              fontSize={'0.875rem'}
              fontWeight={600}
              bg="state.info.main"
              borderRadius={'6px'}
              color="base.100"
              _hover={{
                bg: 'state.info.focus',
              }}
              as="a"
            >
              <FiPlus size={16} color="state.info.content" style={{ marginRight: '0.25rem' }} />
              Create
            </Button>
          </NextLink>
        )}
      </Flex>
      {showSearchFilter && (
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'flex-start', md: 'space-between' }}
          gap={{ base: 2, md: 0 }}
        >
          <Box>
            <SearchInput value={params.searchTerm} onChange={onSearchTermChange} />
          </Box>
        </Flex>
      )}

      {error && (
        <Box>
          <Error error={error} />
        </Box>
      )}
      {deleteError && (
        <Box>
          <Error error={deleteError} />{' '}
        </Box>
      )}
      {table}
    </Flex>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'order_current',
    operation: AccessOperationEnum.READ,
  }),
  withAppLayout(),
)(OrderCurrentListPage);
