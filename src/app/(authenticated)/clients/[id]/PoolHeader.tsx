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

  return (
    <div className="Form inline-flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white p-6">
      <div className="inline-flex w-full items-end justify-center gap-4">
        <div className="inline-flex w-full items-start justify-start gap-4 self-stretch border-b border-zinc-200">
          <div className="border-none text-sm font-medium">{pool.name}</div>
          <Separator orientation="vertical" />
          <div
            onClick={() => handleTabChange('pool_info')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div
              className={`text-sm font-semibold leading-tight tracking-tight hover:cursor-pointer ${tab === 'pool_info' ? 'border-m border-neutral-800 text-neutral-800' : 'text-gray-500'}`}
            >
              Information
            </div>
            {tab === 'pool_info' && (
              <div className="h-0.5 self-stretch bg-neutral-800" />
            )}
          </div>
          <div
            onClick={() => handleTabChange('services')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div
              className={`text-sm font-medium leading-tight tracking-tight hover:cursor-pointer ${tab === 'services' ? 'text-neutral-800' : 'text-gray-500'}`}
            >
              Services
            </div>
            {tab === 'services' && (
              <div className="Rectangle2 h-0.5 self-stretch bg-neutral-800" />
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
