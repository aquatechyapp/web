import { useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';

import { Pool } from '@/ts/interfaces/Pool';
import { Service } from '@/ts/interfaces/Service';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeletePool } from '@/hooks/react-query/pools/deletePool';
import { useDeactivatePool } from '@/hooks/react-query/pools/deactivatePool';

import AssignmentsDatatable from './components/assignments-datatable';
import { EquipmentTab, ChecklistTab, PoolInfoTab, RequestsTab, ServicesTab } from './tabs';
import { useUpdatePool } from '@/hooks/react-query/pools/updatePool';

type Props = {
  services: Service[];
  pool: Pool;
  clientId: string;
};

export type PoolTabOptions = 'pool_info' | 'services' | 'pool_assignments' | 'equipment' | 'checklist' | 'requests';

// Add these styles at the top of your component
const tabStyles = 'px-4 py-2 text-sm transition-colors duration-200 hover:text-gray-700 hover:cursor-pointer';
const activeTabStyles = 'font-medium text-gray-800 border-b-2 border-sky-600';
const headerStyles = 'bg-gray-50 shadow-sm  rounded-t-lg';

function PoolCard({ pool, services, clientId }: Props) {
  const [tab, setTab] = useState<PoolTabOptions>('pool_info');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { mutate: deletePool, isPending: isPendingDeletePool } = useDeletePool(['clients', clientId], pool.id);
  const { mutate: deactivatePool, isPending: isPendingDeactivatePool } = useDeactivatePool(['clients', clientId], pool.id);
  const { mutate, isPending: isPendingUpdatePool } = useUpdatePool();

  const handleTabChange = (tab: PoolTabOptions) => {
    setTab(tab);
  };

  const handleConfirmToggle = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleToggleActive = () => {
    if (pool.isActive) {
      deactivatePool();
    } else {
      mutate({
        data: {
          poolId: pool.id,
          isActive: true,
        },
      });
    }
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
    <div className="flex w-full flex-col rounded-lg border border-gray-200 bg-white">
      <div className="w-full">
        <div className={headerStyles}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm text-gray-900">{pool.name}</h3>
              {!pool.isActive && (
                <span className="text-sm text-red-500 font-medium">(Deactivated)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
                <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleConfirmToggle}
                      className="text-sm"
                      disabled={isPendingDeactivatePool || isPendingUpdatePool}
                    >
                      {isPendingDeactivatePool
                        ? 'Deactivating...'
                        : isPendingUpdatePool
                          ? 'Activating...'
                          : pool.isActive
                            ? 'Deactivate'
                            : 'Activate'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {pool.isActive ? 'Deactivate Pool' : 'Activate Pool'}
                      </DialogTitle>
                      <DialogDescription>
                        {pool.isActive
                          ? 'Are you sure you want to deactivate this pool?'
                          : 'Are you sure you want to activate this pool?'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsConfirmDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant={pool.isActive ? 'destructive' : 'default'}
                        onClick={handleToggleActive}
                      >
                        {pool.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={isPendingDeletePool}
                  >
                    <MdDeleteOutline className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Pool</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Are you sure you want to delete this pool? This action will permanently delete all assignments, services, requests, and checklist associated with this pool. This action is irreversible.
                  </DialogDescription>
                  <div className="flex w-full justify-around pt-4">
                    <DialogTrigger className="w-fit" asChild>
                      <Button onClick={() => deletePool()} variant="destructive">
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger className="w-fit" asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
            <div
              onClick={() => handleTabChange('requests')}
              className={`${tabStyles} whitespace-nowrap ${tab === 'requests' && activeTabStyles}`}
            >
              Requests
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
        {tab === 'requests' && <RequestsTab requests={pool.requests || []} poolId={pool.id} clientId={clientId} />}
      </div>
    </div>
    </>
  );
}

export default function PoolHeader({ pools, clientId }: { pools: Pool[]; clientId: string }) {
  return pools.map((pool) => <PoolCard clientId={clientId} key={pool.id} services={pool.services || []} pool={pool} />);
}
