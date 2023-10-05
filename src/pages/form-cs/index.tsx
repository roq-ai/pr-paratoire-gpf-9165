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
import { getFormCS, deleteFormCById } from 'apiSdk/form-cs';
import { FormCInterface } from 'interfaces/form-c';

type ColumnType = ColumnDef<FormCInterface, unknown>;

interface FormCListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
  tableOnly?: boolean;
  hideActions?: boolean;
}

export function FormCListPage(props: FormCListPageProps) {
  const {
    filters = {},
    titleProps = {},
    showSearchFilter = false,
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
      getFormCS({
        relations: [
          'user',
          'client_profile',
          'order_current_form_c_order_idToorder_current',
          'form_a',
          'order_current_order_current_form_c_idToform_c.count',
        ],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: [],
        ...(params.filters || {}),
      }),
    [params.pageSize, params.pageNumber, params.searchTerm, params.order, params.filters],
  );

  const { data, error, isLoading, mutate } = useSWR<PaginatedInterface<FormCInterface>>(
    () => `/form-cs?params=${JSON.stringify(params)}`,
    fetcher,
  );

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteFormCById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: FormCInterface) => {
    if (hasAccess('form_c', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/form-cs/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    {
      id: 'controle_elements_disponible',
      header: 'Controle Elements Disponible',
      accessorKey: 'controle_elements_disponible',
    },
    {
      id: 'controle_pharmacotechniques',
      header: 'Controle Pharmacotechniques',
      accessorKey: 'controle_pharmacotechniques',
    },
    { id: 'decision_liberation', header: 'Decision Liberation', accessorKey: 'decision_liberation' },
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
    hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_current_form_c_order_idToorder_current',
          header: 'Order Current Form C Order Id Toorder Current',
          accessorKey: 'order_current_form_c_order_idToorder_current',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/order-currents/view/${record.order_current_form_c_order_idToorder_current?.id}`}
            >
              {record.order_current_form_c_order_idToorder_current?.form_a_pdf_path}
            </Link>
          ),
        }
      : null,
    hasAccess('form_a', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_a',
          header: 'Form A',
          accessorKey: 'form_a',
          cell: ({ row: { original: record } }: any) => (
            <Link as={NextLink} onClick={(e) => e.stopPropagation()} href={`/form-as/view/${record.form_a?.id}`}>
              {record.form_a?.sex}
            </Link>
          ),
        }
      : null,
    hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_current_order_current_form_c_idToform_c',
          header: 'Order Current Order Current Form C Id Toform C',
          accessorKey: 'order_current_order_current_form_c_idToform_c',
          cell: ({ row: { original: record } }: any) => record?._count?.order_current_order_current_form_c_idToform_c,
        }
      : null,

    !hideActions
      ? {
          id: 'actions',
          header: '',
          accessorKey: 'actions',
          cell: ({ row: { original: record } }: any) => (
            <Flex justifyContent="flex-end">
              <NextLink href={`/form-cs/view/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('form_c', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                <NextLink href={`/form-cs/edit/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('form_c', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
            Form CS
          </Text>
          <AccessInfo entity="form_c" />
        </Flex>

        {hasAccess('form_c', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <NextLink href={`/form-cs/create`} passHref legacyBehavior>
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
    entity: 'form_c',
    operation: AccessOperationEnum.READ,
  }),
  withAppLayout(),
)(FormCListPage);
