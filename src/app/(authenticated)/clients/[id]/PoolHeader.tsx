import { useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { Pool } from '@/ts/interfaces/Pool';
import { Service } from '@/ts/interfaces/Service';

import BasicInformation from './PoolInfo';
import ServicesDatatable from './components/services-datatable';
import AssignmentsDatatable from './components/assignments-datatable';

type Props = {
  services: Service[];
  pool: Pool;
  clientId: string;
};

export type PoolTabOptions = 'pool_info' | 'services' | 'pool_assignments';

function PoolCard({ pool, services, clientId }: Props) {
  const [tab, setTab] = useState<PoolTabOptions>('pool_info');

  const handleTabChange = (tab: PoolTabOptions) => {
    setTab(tab);
  };

  const selectedTabStyles = 'text-white font-semibold border-m';

  return (
    <div className="Form inline-flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-gray-50">
      <div className="inline-flex w-full items-end justify-center gap-4">
        <div className="inline-flex w-full items-start justify-start gap-4 self-stretch rounded-md border-b border-gray-200 bg-gradient-to-b from-sky-600 to-teal-600 px-2 pt-2">
          <div className="border-none text-sm font-medium text-white">{pool.name}</div>
          <Separator orientation="vertical" />
          <div
            onClick={() => handleTabChange('pool_info')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div className={`text-sm text-white hover:cursor-pointer ${tab === 'pool_info' && selectedTabStyles}`}>
              Information
            </div>
            {tab === 'pool_info' && <div className="h-0.5 self-stretch bg-gray-800 text-white" />}
          </div>
          <div
            onClick={() => handleTabChange('services')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div className={`text-sm text-white hover:cursor-pointer ${tab === 'services' && selectedTabStyles}`}>
              Services
            </div>
            {tab === 'services' && <div className="Rectangle2 h-0.5 self-stretch bg-gray-800" />}
          </div>
          <div
            onClick={() => handleTabChange('pool_assignments')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div
              className={`text-sm text-white hover:cursor-pointer ${tab === 'pool_assignments' && selectedTabStyles}`}
            >
              Assignments
            </div>
            {tab === 'pool_assignments' && <div className="Rectangle2 h-0.5 self-stretch bg-gray-800" />}
          </div>
        </div>
      </div>
      {tab === 'pool_info' && <BasicInformation clientId={clientId} pool={pool} />}
      {tab === 'services' && <ServicesDatatable services={services} pool={pool} />}
      {tab === 'pool_assignments' && <AssignmentsDatatable data={pool.assignments || []} />}
    </div>
  );
}

export default function PoolHeader({ pools, clientId }: { pools: Pool[]; clientId: string }) {
  return pools.map((pool) => <PoolCard clientId={clientId} key={pool.id} services={pool.services || []} pool={pool} />);
}
