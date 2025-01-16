'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PaginationDemo } from '@/components/PaginationDemo';
import SelectField from '@/components/SelectField';
import { DatePicker } from '@/components/ui/date-picker';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useUserStore } from '@/store/user';
import { SubcontractorStatus } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';
import { buildSelectOptions } from '@/utils/formUtils';

import { DataTableRequests } from './DataTableRequests';
import { columns } from './DataTableRequests/columns';
import useGetServices from '@/hooks/react-query/services/getServices';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';

export default function Page() {
  const form = useForm({
    defaultValues: {
      fromDate: undefined,
      toDate: undefined
      // memberId: null,
      // clientId: null,
      // companyOwnerId: null
    }
  });

  const [filters, setFilters] = useState({
    from: '',
    to: '',
    memberId: null,
    clientId: null,
    companyOwnerId: null,
    page: 1 // Página inicial como 1
  });

  const { data: clients, isLoading: isLoadingClients } = useGetClients();

  const { data: services } = useGetServices(filters);
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: members } = useGetMembersOfAllCompaniesByUserId(user.id);
  const { data: companies } = useGetCompanies();

  useEffect(() => {
    if (!user?.firstName) {
      router.push('/account');
    }
  }, [user, router]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (formData: any) => {
    try {
      const { fromDate, toDate, memberId, clientId, companyOwnerId } = formData;

      setFilters({
        from: fromDate?.toString() || '',
        to: toDate?.toString() || '',
        memberId: memberId,
        clientId: clientId,
        companyOwnerId,
        page: 1 // Reseta a página para 1 ao aplicar novos filtros
      });

      setCurrentPage(1); // Atualiza o estado de currentPage para 1
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  const handlePageChange = (page: number) => {
    // console.log('Changing to page:', page); // Debug
    setCurrentPage(page); // Atualiza a página atual
    setFilters((prev) => ({ ...prev, page })); // Atualiza os filtros com a nova página
  };

  return (
    <FormProvider {...form}>
      <DataTableRequests
        columns={columns}
        children={
          <div className="flex gap-4">
            <form className="flex w-full gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <SelectField
                disabled={companies.length === 0}
                name="companyOwnerId"
                placeholder="Select company"
                options={
                  companies.length > 0
                    ? companies.map((company) => {
                        return {
                          key: company.id,
                          value: company.id,
                          name: company.name
                        };
                      })
                    : []
                }
                onValueChange={(value) => handleFilterChange('companyOwnerId', value)}
              />
              <SelectField
                disabled={members.length === 0}
                name="memberId"
                placeholder="Select member"
                options={
                  members.length > 0
                    ? members.map((member) => {
                        return {
                          key: member.id,
                          value: member.id,
                          name: member.firstName + ' ' + member.lastName
                        };
                      })
                    : []
                }
                onValueChange={(value) => handleFilterChange('memberId', value)}
              />
              <SelectField
                options={buildSelectOptions(
                  clients?.filter((client: Client) => client.pools.length > 0),
                  {
                    key: 'id',
                    name: 'fullName',
                    value: 'id'
                  }
                )}
                placeholder={clients?.length || 0 > 0 ? 'Select client' : 'No clients available'}
                name="clientId"
                onValueChange={(e) => handleFilterChange('clientId', e)}
              />

              <DatePicker
                placeholder="Created From"
                onChange={(date) => handleFilterChange('from', date?.toISOString().slice(0, 10) || '')} // Slice is to get only the date part in a format backend can understand
              />
              <DatePicker
                placeholder="Created To"
                onChange={(date) => handleFilterChange('to', date?.toISOString().slice(0, 10) || '')} // Slice is to get only the date part in a format backend can understand
              />
            </form>
          </div>
        }
        data={services || []}
      />

      <PaginationDemo currentPage={currentPage} totalItems={services?.length} onPageChange={handlePageChange} />
    </FormProvider>
  );
}
