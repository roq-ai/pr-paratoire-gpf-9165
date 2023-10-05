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

import { getFormBById } from 'apiSdk/form-bs';
import { FormBInterface } from 'interfaces/form-b';
import { OrderCurrentListPage } from 'pages/order-currents';

function FormBViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FormBInterface>(
    () => (id ? `/form-bs/${id}` : null),
    () =>
      getFormBById(id, {
        relations: [
          'client_profile',
          'user',
          'form_a_form_b_name_patientToform_a',
          'form_a_form_b_sexToform_a',
          'order_current_form_b_order_idToorder_current',
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
              label: 'Form BS',
              link: '/form-bs',
            },
            {
              label: 'Form B Details',
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
                    Form B Details
                  </Text>
                </Box>
                {hasAccess('form_b', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                  <NextLink href={`/form-bs/edit/${id}`} passHref legacyBehavior>
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

                <FormListItem
                  label="Submission Date"
                  text={
                    data?.submission_date
                      ? format(parseISO(data?.submission_date as unknown as string), 'dd-MM-yyyy')
                      : ''
                  }
                />

                <FormListItem label="Forme Pharmaceutique" text={data?.forme_pharmaceutique} />

                <FormListItem label="Modalite D Administration" text={data?.modalite_d_administration} />

                <FormListItem
                  label="Decision Sous Traiter Preparation"
                  text={data?.decision_sous_traiter_preparation}
                />

                <FormListItem label="Decision Realiser Preparation" text={data?.decision_realiser_preparation} />

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
                {hasAccess('form_a', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Form A Form B Name Patient Toform A"
                    text={
                      <Link as={NextLink} href={`/form-as/view/${data?.form_a_form_b_name_patientToform_a?.id}`}>
                        {data?.form_a_form_b_name_patientToform_a?.sex}
                      </Link>
                    }
                  />
                )}
                {hasAccess('form_a', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Form A Form B Sex Toform A"
                    text={
                      <Link as={NextLink} href={`/form-as/view/${data?.form_a_form_b_sexToform_a?.id}`}>
                        {data?.form_a_form_b_sexToform_a?.sex}
                      </Link>
                    }
                  />
                )}
                {hasAccess('order_current', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Order Current Form B Order Id Toorder Current"
                    text={
                      <Link
                        as={NextLink}
                        href={`/order-currents/view/${data?.order_current_form_b_order_idToorder_current?.id}`}
                      >
                        {data?.order_current_form_b_order_idToorder_current?.form_a_pdf_path}
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
    entity: 'form_b',
    operation: AccessOperationEnum.READ,
  }),
)(FormBViewPage);
