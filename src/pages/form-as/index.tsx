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
import { getFormAS, deleteFormAById } from 'apiSdk/form-as';
import { FormAInterface } from 'interfaces/form-a';

type ColumnType = ColumnDef<FormAInterface, unknown>;

interface FormAListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
  tableOnly?: boolean;
  hideActions?: boolean;
}

export function FormAListPage(props: FormAListPageProps) {
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
      getFormAS({
        relations: [
          'client_profile',
          'user',
          'order_current_form_a_order_idToorder_current',
          'form_b_form_b_name_patientToform_a.count',
          'form_b_form_b_sexToform_a.count',
          'form_c.count',
          'order_current_order_current_form_a_idToform_a.count',
          'order_history_client.count',
          'pdf_file.count',
        ],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: ['sex.contains', 'name_patient.contains', 'medication_details.contains'],
        ...(params.filters || {}),
      }),
    [params.pageSize, params.pageNumber, params.searchTerm, params.order, params.filters],
  );

  const { data, error, isLoading, mutate } = useSWR<PaginatedInterface<FormAInterface>>(
    () => `/form-as?params=${JSON.stringify(params)}`,
    fetcher,
  );

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteFormAById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: FormAInterface) => {
    if (hasAccess('form_a', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/form-as/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    {
      id: 'submission_date',
      header: 'Submission Date',
      accessorKey: 'submission_date',
      cell: ({ row: { original: record } }: any) =>
        record?.submission_date ? format(parseISO(record?.submission_date as unknown as string), 'dd-MM-yyyy') : '',
    },
    { id: 'sex', header: 'Sex', accessorKey: 'sex' },
    { id: 'name_patient', header: 'Name Patient', accessorKey: 'name_patient' },
    { id: 'medication_details', header: 'Medication Details', accessorKey: 'medication_details' },
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
    hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_current_form_a_order_idToorder_current',
          header: 'Order Current Form A Order Id Toorder Current',
          accessorKey: 'order_current_form_a_order_idToorder_current',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/order-currents/view/${record.order_current_form_a_order_idToorder_current?.id}`}
            >
              {record.order_current_form_a_order_idToorder_current?.form_a_pdf_path}
            </Link>
          ),
        }
      : null,
    hasAccess('form_b', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_b_form_b_name_patientToform_a',
          header: 'Form B Form B Name Patient Toform A',
          accessorKey: 'form_b_form_b_name_patientToform_a',
          cell: ({ row: { original: record } }: any) => record?._count?.form_b_form_b_name_patientToform_a,
        }
      : null,
    hasAccess('form_b', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_b_form_b_sexToform_a',
          header: 'Form B Form B Sex Toform A',
          accessorKey: 'form_b_form_b_sexToform_a',
          cell: ({ row: { original: record } }: any) => record?._count?.form_b_form_b_sexToform_a,
        }
      : null,
    hasAccess('form_c', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'form_c',
          header: 'Form C',
          accessorKey: 'form_c',
          cell: ({ row: { original: record } }: any) => record?._count?.form_c,
        }
      : null,
    hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_current_order_current_form_a_idToform_a',
          header: 'Order Current Order Current Form A Id Toform A',
          accessorKey: 'order_current_order_current_form_a_idToform_a',
          cell: ({ row: { original: record } }: any) => record?._count?.order_current_order_current_form_a_idToform_a,
        }
      : null,
    hasAccess('order_history_client', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'order_history_client',
          header: 'Order History Client',
          accessorKey: 'order_history_client',
          cell: ({ row: { original: record } }: any) => record?._count?.order_history_client,
        }
      : null,
    hasAccess('pdf_file', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'pdf_file',
          header: 'Pdf File',
          accessorKey: 'pdf_file',
          cell: ({ row: { original: record } }: any) => record?._count?.pdf_file,
        }
      : null,

    !hideActions
      ? {
          id: 'actions',
          header: '',
          accessorKey: 'actions',
          cell: ({ row: { original: record } }: any) => (
            <Flex justifyContent="flex-end">
              <NextLink href={`/form-as/view/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('form_a', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                <NextLink href={`/form-as/edit/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('form_a', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
            Form AS
          </Text>
          <AccessInfo entity="form_a" />
        </Flex>

        {hasAccess('form_a', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <NextLink href={`/form-as/create`} passHref legacyBehavior>
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
    entity: 'form_a',
    operation: AccessOperationEnum.READ,
  }),
  withAppLayout(),
)(FormAListPage);
