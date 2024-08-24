import { useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { Pool } from '@/ts/interfaces/Assignments';
import { Service } from '@/ts/interfaces/Service';

import { DataTableServices } from './DataTableServices';
import { columns } from './DataTableServices/columns';
import BasicInformation from './PoolInfo';

type Props = {
  services: Service[];
  pool: Pool;
  clientId: string;
};

function PoolCard({ pool, services, clientId }: Props) {
  const [tab, setTab] = useState<'pool_info' | 'services'>('pool_info');

  const handleTabChange = (tab: 'pool_info' | 'services') => {
    setTab(tab);
  };

  const selectedTabStyles = 'text-gray-800 font-semibold border-m border-gray-800';

  return (
    <div className="Form inline-flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-gray-50 p-6">
      <div className="inline-flex w-full items-end justify-center gap-4">
        <div className="inline-flex w-full items-start justify-start gap-4 self-stretch border-b border-gray-200">
          <div className="border-none text-sm font-medium">{pool.name}</div>
          <Separator orientation="vertical" />
          <div
            onClick={() => handleTabChange('pool_info')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div className={`text-sm text-gray-500 hover:cursor-pointer ${tab === 'pool_info' && selectedTabStyles}`}>
              Information
            </div>
            {tab === 'pool_info' && <div className="h-0.5 self-stretch bg-gray-800" />}
          </div>
          <div
            onClick={() => handleTabChange('services')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div className={`text-sm text-gray-500 hover:cursor-pointer ${tab === 'services' && selectedTabStyles}`}>
              Services
            </div>
            {tab === 'services' && <div className="Rectangle2 h-0.5 self-stretch bg-gray-800" />}
          </div>
        </div>
      </div>
      {tab === 'pool_info' ? (
        <BasicInformation clientId={clientId} pool={pool} />
      ) : (
        <DataTableServices data={services} columns={columns} />
      )}
    </div>
  );
}

export default function PoolHeader({ pools, clientId }: { pools: Pool[]; clientId: string }) {
  return pools.map((pool) => <PoolCard clientId={clientId} key={pool.id} services={pool.services || []} pool={pool} />);
}
