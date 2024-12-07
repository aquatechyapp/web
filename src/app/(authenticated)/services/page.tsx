'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import useGetServices from '@/hooks/react-query/services/getRequests';
import { useUserStore } from '@/store/user';
import { SubcontractorStatus } from '@/ts/enums/enums';

import { DataTableRequests } from './DataTableRequests';
import { columns } from './DataTableRequests/columns';

export default function Page() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    technicianId: '',
    clientId: '',
    page: 1
  });

  const { data } = useGetServices(filters);
  console.log('filters', filters);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user.firstName) {
      router.push('/account');
    }
  }, [user]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // if (isLoading) return <LoadingSpinner />;

  const subContractors = useMemo(() => {
    if (!user) return [];
    const userAsSubcontractor = {
      key: user.id,
      name: user.firstName + ' ' + user.lastName,
      value: user.id
    };
    return user.workRelationsAsAEmployer
      .filter((sub) => sub.status === SubcontractorStatus.Active)
      .map((sub) => ({
        key: sub.subcontractorId,
        name: sub.subcontractor.firstName + ' ' + sub.subcontractor.lastName,
        value: sub.subcontractorId
      }))
      .concat(userAsSubcontractor);
  }, [user]);

  console.log(subContractors);

  return (
    <DataTableRequests
      columns={columns}
      children={
        <div className="flex gap-4">
          <Input
            className="min-w-50"
            placeholder="Filter clients..."
            onChange={(e) => handleFilterChange('clientId', e.target.value)}
          />
          {/* <SelectField
            disabled={subContractors.length === 0}
            name="assignmentToId"
            placeholder="Select Technician"
            options={subContractors?.length > 0 ? subContractors : []}
          /> */}
          <DatePicker
            placeholder="Created From"
            onChange={(date) => handleFilterChange('from', date?.toISOString() || '')}
          />
          <DatePicker
            placeholder="Created To"
            onChange={(date) => handleFilterChange('to', date?.toISOString() || '')}
          />
        </div>
      }
      data={data?.services || []}
    />
  );
}
