import { useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { Pool } from '@/ts/interfaces/Pool';
import { Service } from '@/ts/interfaces/Service';
import { Equipment } from '@/ts/interfaces/Pool';
import { EquipmentCondition } from '@/ts/enums/enums';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import BasicInformation from './PoolInfo';
import ServicesDatatable from './components/services-datatable';
import AssignmentsDatatable from './components/assignments-datatable';

type Props = {
  services: Service[];
  pool: Pool;
  clientId: string;
};

export type PoolTabOptions = 'pool_info' | 'services' | 'pool_assignments' | 'equipment';

// Add these styles at the top of your component
const tabStyles = 'px-4 py-2 text-sm transition-colors duration-200 hover:text-gray-700 hover:cursor-pointer';
const activeTabStyles = 'font-medium text-gray-800 border-b-2 border-sky-600';
const headerStyles = 'bg-gray-50 shadow-sm  rounded-t-lg';

function EquipmentTab({ equipment }: { equipment: Equipment | null }) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  if (!equipment) {
    return <div className="p-4 text-gray-500">No equipment registered for this pool.</div>;
  }

  const getConditionColor = (condition: EquipmentCondition | undefined) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-orange-100 text-orange-800';
      case 'NeedsReplacement':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Accordion type="single" defaultValue="filter" className="w-full" collapsible>
        <AccordionItem value="filter" className="border-none">
          <AccordionTrigger className="text-md font-semibold hover:no-underline">
            <div className="flex items-center gap-2">
              Filter
              {equipment.filter?.condition && (
                <Badge className={`${getConditionColor(equipment.filter.condition)}`}>
                  {equipment.filter.condition}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Model</h4>
                  <p>{equipment.filter?.model || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Serial Number</h4>
                  <p>{equipment.filter?.serialNumber || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Type</h4>
                  <p>{equipment.filter?.type || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Cleaning</h4>
                  <p>
                    {equipment.filter?.lastCleaningDate
                      ? format(new Date(equipment.filter.lastCleaningDate), 'MMM dd, yyyy')
                      : 'Not recorded'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Replacement Date</h4>
                  <p>
                    {equipment.filter?.replacementDate
                      ? format(new Date(equipment.filter.replacementDate), 'MMM dd, yyyy')
                      : 'Not recorded'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Warranty Expires</h4>
                  <p>
                    {equipment.filter?.warrantyExpirationDate
                      ? format(new Date(equipment.filter.warrantyExpirationDate), 'MMM dd, yyyy')
                      : 'Not recorded'}
                  </p>
                </div>
              </div>

              {equipment.filter?.maintenanceHistory && equipment.filter.maintenanceHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-medium text-gray-500">Maintenance History</h4>
                  <div className="space-y-2">
                    {equipment.filter.maintenanceHistory.map((history, index) => (
                      <div key={index} className="rounded border p-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{history.type}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(history.date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        {history.notes && <p className="mt-1 text-sm">{history.notes}</p>}
                        {history.photos && history.photos.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {history.photos.map((photo, photoIndex) => (
                              <img
                                key={photoIndex}
                                src={photo}
                                alt={`Maintenance photo ${photoIndex + 1}`}
                                className="h-16 w-16 cursor-pointer rounded object-cover transition-opacity hover:opacity-80"
                                onClick={() => {
                                  setSelectedPhotos(history.photos || []);
                                  setIsPhotoModalOpen(true);
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {equipment.filter?.photos && equipment.filter.photos.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-medium text-gray-500">Equipment Photos</h4>
                  <div className="flex flex-wrap gap-4">
                    {equipment.filter.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Filter photo ${index + 1}`}
                        className="h-24 w-24 rounded object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-4xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Maintenance photo ${index + 1}`}
                className="h-64 w-full rounded object-cover"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
            <h3 className="text-md text-gray-900">{pool.name}</h3>
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
          </div>
        </div>
      </div>

      <div className="p-6">
        {tab === 'pool_info' && <BasicInformation clientId={clientId} pool={pool} />}
        {tab === 'services' && <ServicesDatatable services={services} pool={pool} />}
        {tab === 'pool_assignments' && <AssignmentsDatatable data={pool.assignments || []} />}
        {tab === 'equipment' && <EquipmentTab equipment={pool.equipment || null} />}
      </div>
    </div>
  );
}

export default function PoolHeader({ pools, clientId }: { pools: Pool[]; clientId: string }) {
  return pools.map((pool) => <PoolCard clientId={clientId} key={pool.id} services={pool.services || []} pool={pool} />);
}
