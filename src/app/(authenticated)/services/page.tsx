'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PaginationDemo } from '@/components/PaginationDemo';
import SelectField from '@/components/SelectField';
import { DatePicker } from '@/components/ui/date-picker';
import useGetClients from '@/hooks/react-query/clients/getClients';
import useGetServices from '@/hooks/react-query/services/getRequests';
import { useUserStore } from '@/store/user';
import { SubcontractorStatus } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';
import { buildSelectOptions } from '@/utils/formUtils';

import { DataTableRequests } from './DataTableRequests';
import { columns } from './DataTableRequests/columns';

export default function Page() {
  const form = useForm({
    defaultValues: {
      fromDate: undefined,
      toDate: undefined,
      assignmentToId: ''
    }
  });

  const [filters, setFilters] = useState({
    from: '',
    to: '',
    technicianId: '',
    clientId: '',
    page: 1 // Página inicial como 1
  });

  const { data: clients, isLoading: isLoadingClients } = useGetClients();

  const { data, isLoading } = useGetServices(filters);
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // console.log('data', data);

  useEffect(() => {
    if (!user?.firstName) {
      router.push('/account');
    }
  }, [user, router]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const subContractors = useMemo(() => {
    if (!user) return [];
    const userAsSubcontractor = {
      key: user.id,
      name: `${user.firstName} ${user.lastName}`,
      value: user.id
    };
    return user?.workRelationsAsAEmployer?.filter((sub) => sub.status === SubcontractorStatus.Active)
      .map((sub) => ({
        key: sub.subcontractorId,
        name: `${sub.subcontractor.firstName} ${sub.subcontractor.lastName}`,
        value: sub.subcontractorId
      })) || []
        .concat(userAsSubcontractor);
  }, [user]);

  const handleSubmit = async (formData: any) => {
    try {
      const { fromDate, toDate, assignmentToId, clientId } = formData;

      setFilters({
        from: fromDate?.toString() || '',
        to: toDate?.toString() || '',
        technicianId: assignmentToId,
        clientId: clientId,
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
                options={buildSelectOptions(
                  clients?.filter((client: Client) => client.pools.length > 0),
                  {
                    key: 'id',
                    name: 'fullName',
                    value: 'id'
                  }
                )}
                placeholder={clients?.length || 0 > 0 ? 'Clients' : 'No clients available'}
                name="clientId"
                onValueChange={(e) => handleFilterChange('clientId', e)}
              />
              <SelectField
                disabled={subContractors.length === 0}
                name="technicianId"
                placeholder="Select Technician"
                options={subContractors.length > 0 ? subContractors : []}
                onValueChange={(value) => handleFilterChange('technicianId', value)}
              />
              <DatePicker
                placeholder="Created From"
                onChange={(date) => handleFilterChange('from', date?.toISOString() || '')}
              />
              <DatePicker
                placeholder="Created To"
                onChange={(date) => handleFilterChange('to', date?.toISOString() || '')}
              />
            </form>
          </div>
        }
        data={data?.services || []}
      />

      <PaginationDemo currentPage={currentPage} totalItems={data?.services.length} onPageChange={handlePageChange} />
    </FormProvider>
  );
}
