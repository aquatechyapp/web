import { useState } from 'react';

import { Pool } from '@/ts/interfaces/Pool';
import { Service } from '@/ts/interfaces/Service';

import AssignmentsDatatable from './components/assignments-datatable';
import { EquipmentTab, ChecklistTab, PoolInfoTab, ServicesTab } from './tabs';

type Props = {
  services: Service[];
  pool: Pool;
  clientId: string;
};

export type PoolTabOptions = 'pool_info' | 'services' | 'pool_assignments' | 'equipment' | 'checklist';

// Add these styles at the top of your component
const tabStyles = 'px-4 py-2 text-sm transition-colors duration-200 hover:text-gray-700 hover:cursor-pointer';
const activeTabStyles = 'font-medium text-gray-800 border-b-2 border-sky-600';
const headerStyles = 'bg-gray-50 shadow-sm  rounded-t-lg';

function PoolCard({ pool, services, clientId }: Props) {
  const [tab, setTab] = useState<PoolTabOptions>('pool_info');

  const handleTabChange = (tab: PoolTabOptions) => {
    setTab(tab);
  };

  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white">
      <div className="w-full">
        <div className={headerStyles}>
          <div className="flex items-center gap-4 px-6 py-4">
            <h3 className="text-sm text-gray-900">{pool.name}</h3>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto border-t border-gray-100 px-6 md:gap-6">
            <div
              onClick={() => handleTabChange('pool_info')}
              className={`${tabStyles} whitespace-nowrap ${tab === 'pool_info' && activeTabStyles}`}
            >
              Information
            </div>
            <div
              onClick={() => handleTabChange('services')}
              className={`${tabStyles} whitespace-nowrap ${tab === 'services' && activeTabStyles}`}
            >
              Services
            </div>
            <div
              onClick={() => handleTabChange('pool_assignments')}
              className={`${tabStyles} whitespace-nowrap ${tab === 'pool_assignments' && activeTabStyles}`}
            >
              Assignments
            </div>
            <div
              onClick={() => handleTabChange('equipment')}
              className={`${tabStyles} whitespace-nowrap ${tab === 'equipment' && activeTabStyles}`}
            >
              Equipment
            </div>
            <div
              onClick={() => handleTabChange('checklist')}
              className={`${tabStyles} whitespace-nowrap ${tab === 'checklist' && activeTabStyles}`}
            >
              Checklist
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {tab === 'pool_info' && <PoolInfoTab pool={pool} clientId={clientId} />}
        {tab === 'services' && <ServicesTab services={services} pool={pool} />}
        {tab === 'pool_assignments' && <AssignmentsDatatable data={pool.assignments || []} />}
        {tab === 'equipment' && (
          <EquipmentTab equipment={pool.equipment || null} poolId={pool.id} clientId={clientId} />
        )}
        {tab === 'checklist' && <ChecklistTab poolId={pool.id} clientId={clientId} pool={pool} />}
      </div>
    </div>
  );
}

export default function PoolHeader({ pools, clientId }: { pools: Pool[]; clientId: string }) {
  return pools.map((pool) => <PoolCard clientId={clientId} key={pool.id} services={pool.services || []} pool={pool} />);
}