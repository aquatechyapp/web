import { useState } from 'react';
import BasicInformation from './PoolInfo';
import { DataTableServices } from './DataTableServices';
import { columns } from './DataTableServices/columns';
import { Separator } from '@/components/ui/separator';

function PoolCard({ form, pool, services }) {
  const [tab, setTab] = useState<'pool_info' | 'services'>('pool_info');

  const handleTabChange = (tab: 'pool_info' | 'services') => {
    setTab(tab);
  };

  const selectedTabStyles =
    'text-gray-800 font-semibold border-m border-gray-800';

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
            <div
              className={`text-sm  text-gray-500 hover:cursor-pointer ${tab === 'pool_info' && selectedTabStyles}`}
            >
              Information
            </div>
            {tab === 'pool_info' && (
              <div className="h-0.5 self-stretch bg-gray-800" />
            )}
          </div>
          <div
            onClick={() => handleTabChange('services')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div
              className={`text-sm  text-gray-500 hover:cursor-pointer ${tab === 'services' && selectedTabStyles}`}
            >
              Services
            </div>
            {tab === 'services' && (
              <div className="Rectangle2 h-0.5 self-stretch bg-gray-800" />
            )}
          </div>
        </div>
      </div>
      {tab === 'pool_info' ? (
        <BasicInformation form={form} pool={pool} />
      ) : (
        <DataTableServices data={services} columns={columns} />
      )}
    </div>
  );
}

export default function PoolHeader({ form, pools }) {
  return pools.map((pool) => (
    <PoolCard
      form={form}
      key={pool.id}
      services={pool.services || []}
      pool={pool}
    />
  ));
}
