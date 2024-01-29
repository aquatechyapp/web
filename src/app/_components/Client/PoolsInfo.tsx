import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import BasicInformation from './BasicInformation';
import Services from './Services';

function PoolCard() {
  const [tab, setTab] = useState<'pool_info' | 'services'>('pool_info');

  const handleTabChange = (tab: 'pool_info' | 'services') => {
    setTab(tab);
  };
  return (
    <div className="Form inline-flex h-[388px] flex-col items-start justify-start gap-4 rounded-lg bg-white p-6">
      <div className="inline-flex w-[100%] items-end justify-center gap-4">
        <Button className="ButtonMedium flex items-center justify-start gap-2 rounded-lg border border-gray-200  p-3">
          <MdOutlineEdit />
        </Button>
        <Button
          variant={'destructive'}
          className="ButtonMedium flex items-center justify-start gap-2 rounded-lg border border-gray-200  p-3"
        >
          <MdDeleteOutline />
        </Button>
        <div className="inline-flex w-[100%] items-start justify-start gap-4 self-stretch border-b border-zinc-200">
          <div
            onClick={() => handleTabChange('pool_info')}
            className="inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div
              className={`font-['Public Sans'] text-sm font-semibold leading-tight tracking-tight hover:cursor-pointer ${tab === 'pool_info' ? 'border-m border-neutral-800 text-neutral-800' : 'text-gray-500'}`}
            >
              Basic information
            </div>
            {tab === 'pool_info' && (
              <div className="Rectangle2 h-0.5 self-stretch bg-neutral-800" />
            )}
          </div>
          <div
            onClick={() => handleTabChange('services')}
            className="RegularTab inline-flex flex-col items-start justify-start gap-2.5"
          >
            <div
              className={`font-['Public Sans'] text-sm font-medium leading-tight tracking-tight hover:cursor-pointer ${tab === 'services' ? 'text-neutral-800' : 'text-gray-500'}`}
            >
              Services
            </div>
            {tab === 'services' && (
              <div className="Rectangle2 h-0.5 self-stretch bg-neutral-800" />
            )}
          </div>
        </div>
      </div>
      {tab === 'pool_info' ? <BasicInformation /> : <Services />}
    </div>
  );
}

export default function PoolsInfo() {
  const pools = [{ pool: 'pool' }];
  return pools.map((pool) => <PoolCard key={pool.id} pool={pool} />);
}
