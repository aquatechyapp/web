import { useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { Pool } from '@/ts/interfaces/Pool';
import { Service } from '@/ts/interfaces/Service';
import { Equipment } from '@/ts/interfaces/Pool';
import { EquipmentCondition, FieldType } from '@/ts/enums/enums';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateFilter } from '@/hooks/react-query/pools/updateFilter';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { FilterType } from '@/ts/enums/enums';

import BasicInformation from './PoolInfo';
import ServicesDatatable from './components/services-datatable';
import AssignmentsDatatable from './components/assignments-datatable';
import { useQueryClient } from '@tanstack/react-query';

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

function EquipmentTab({
  equipment,
  poolId,
  clientId
}: {
  equipment: Equipment | null;
  poolId: string;
  clientId: string;
}) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const { mutate: updateFilter, isPending } = useUpdateFilter();
  const [isMaintenanceHistoryModalOpen, setIsMaintenanceHistoryModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const filterSchema = z.object({
    model: z.string().optional(),
    serialNumber: z.string().optional(),
    type: z.enum(['Sand', 'Cartridge', 'DE', 'Other']).optional().nullable(),
    condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'NeedsReplacement']).optional().nullable(),
    recommendedCleaningIntervalDays: z.preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z.number().optional()
    ),
    warrantyExpirationDate: z.string().optional(),
    replacementDate: z.string().optional(),
    lastCleaningDate: z.string().optional()
  });

  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      model: equipment?.filter?.model || '',
      serialNumber: equipment?.filter?.serialNumber || '',
      type: equipment?.filter?.type,
      condition: equipment?.filter?.condition,
      recommendedCleaningIntervalDays: equipment?.filter?.recommendedCleaningIntervalDays,
      warrantyExpirationDate: equipment?.filter?.warrantyExpirationDate
        ? new Date(equipment.filter.warrantyExpirationDate).toISOString().split('T')[0]
        : undefined,
      replacementDate: equipment?.filter?.replacementDate
        ? new Date(equipment.filter.replacementDate).toISOString().split('T')[0]
        : undefined,
      lastCleaningDate: equipment?.filter?.lastCleaningDate
        ? new Date(equipment.filter.lastCleaningDate).toISOString().split('T')[0]
        : undefined
    }
  });

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    const filterData: Record<string, any> = {};

    if (data.model) filterData.model = data.model;
    if (data.serialNumber) filterData.serialNumber = data.serialNumber;
    if (data.type) filterData.type = data.type;
    if (data.condition) filterData.condition = data.condition;
    if (data.recommendedCleaningIntervalDays)
      filterData.recommendedCleaningIntervalDays = Number(data.recommendedCleaningIntervalDays);

    // Format dates to include timezone
    const formatDateWithTimezone = (dateStr: string) => {
      const date = new Date(dateStr);
      return date;
    };

    if (data.warrantyExpirationDate) {
      filterData.warrantyExpirationDate = formatDateWithTimezone(data.warrantyExpirationDate);
    }
    if (data.replacementDate) {
      filterData.replacementDate = formatDateWithTimezone(data.replacementDate);
    }
    if (data.lastCleaningDate) {
      filterData.lastCleaningDate = formatDateWithTimezone(data.lastCleaningDate);
    }

    updateFilter(
      {
        poolId,
        filter: filterData
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingField(null);
          queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
        }
      }
    );
  };

  if (!equipment) {
    return <div className="p-4 text-gray-500">No equipment registered for this pool.</div>;
  }

  return (
    <>
      <Accordion type="single" defaultValue="filter" className="w-full" collapsible>
        <AccordionItem value="filter" className="border-none">
          <AccordionTrigger className="text-md font-semibold hover:no-underline">
            <div className="flex w-full items-center gap-2">
              <div className="flex items-center gap-2">Filter</div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </Button>
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
                  <h4 className="text-sm font-medium text-gray-500">Condition</h4>
                  <p>{equipment.filter?.condition || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Recommended Cleaning Interval</h4>
                  <p>
                    {equipment.filter?.recommendedCleaningIntervalDays
                      ? `${equipment.filter.recommendedCleaningIntervalDays} days`
                      : 'Not specified'}
                  </p>
                </div>
                <div className="grid-item">
                  <h4 className="text-sm font-medium text-gray-500">Last Cleaning Date</h4>
                  <p>
                    {equipment.filter?.lastCleaningDate
                      ? format(new Date(equipment.filter.lastCleaningDate), 'MM/dd/yyyy')
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Replacement Date</h4>
                  <p>
                    {equipment.filter?.replacementDate
                      ? format(new Date(equipment.filter.replacementDate), 'MM/dd/yyyy')
                      : 'Not recorded'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Warranty Expires</h4>
                  <p>
                    {equipment.filter?.warrantyExpirationDate
                      ? format(new Date(equipment.filter.warrantyExpirationDate), 'MM/dd/yyyy')
                      : 'Not recorded'}
                  </p>
                </div>
              </div>

              {equipment.filter?.maintenanceHistory && equipment.filter.maintenanceHistory.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-500">Maintenance History</h4>
                    <Button variant="outline" size="sm" onClick={() => setIsMaintenanceHistoryModalOpen(true)}>
                      View
                    </Button>
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Filter Information</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputField name="model" label="Model" placeholder="Enter model" />
                  <InputField name="serialNumber" label="Serial Number" placeholder="Enter serial number" />
                  <SelectField
                    name="type"
                    label="Filter Type"
                    placeholder="Select filter type"
                    options={[
                      { key: 'Sand', value: 'Sand', name: 'Sand' },
                      { key: 'Cartridge', value: 'Cartridge', name: 'Cartridge' },
                      { key: 'DE', value: 'DE', name: 'DE' },
                      { key: 'Other', value: 'Other', name: 'Other' }
                    ]}
                  />
                  <SelectField
                    name="condition"
                    label="Condition"
                    placeholder="Select condition"
                    options={[
                      { key: 'Excellent', value: 'Excellent', name: 'Excellent' },
                      { key: 'Good', value: 'Good', name: 'Good' },
                      { key: 'Fair', value: 'Fair', name: 'Fair' },
                      { key: 'Poor', value: 'Poor', name: 'Poor' },
                      { key: 'NeedsReplacement', value: 'NeedsReplacement', name: 'Needs Replacement' }
                    ]}
                  />
                  <InputField
                    name="recommendedCleaningIntervalDays"
                    label="Cleaning Interval (Days)"
                    type={FieldType.Number}
                    placeholder="Enter days"
                    value={
                      equipment.filter?.recommendedCleaningIntervalDays
                        ? equipment.filter.recommendedCleaningIntervalDays.toString()
                        : ''
                    }
                  />
                  <InputField
                    name="lastCleaningDate"
                    label="Last Cleaning Date"
                    type={FieldType.Date}
                    placeholder="Select date"
                    value={
                      equipment.filter?.lastCleaningDate
                        ? format(new Date(equipment.filter.lastCleaningDate), 'yyyy-MM-dd')
                        : ''
                    }
                  />
                  <InputField
                    name="warrantyExpirationDate"
                    label="Warranty Expiration"
                    type={FieldType.Date}
                    placeholder="Enter date"
                    value={
                      equipment.filter?.warrantyExpirationDate
                        ? format(new Date(equipment.filter.warrantyExpirationDate), 'yyyy-MM-dd')
                        : ''
                    }
                  />
                  <InputField
                    name="replacementDate"
                    label="Replacement Date"
                    type={FieldType.Date}
                    placeholder="Enter date"
                    value={
                      equipment.filter?.replacementDate
                        ? format(new Date(equipment.filter.replacementDate), 'yyyy-MM-dd')
                        : ''
                    }
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

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

      <Dialog open={isMaintenanceHistoryModalOpen} onOpenChange={setIsMaintenanceHistoryModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Maintenance History</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {equipment.filter?.maintenanceHistory?.map((history, index) => (
                <div key={index} className="rounded border p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{history.type}</span>
                    <span className="text-sm text-gray-500">{format(new Date(history.date), 'MMM dd, yyyy')}</span>
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
          </div>
        </div>
      </div>

      <div className="p-6">
        {tab === 'pool_info' && <BasicInformation clientId={clientId} pool={pool} />}
        {tab === 'services' && <ServicesDatatable services={services} pool={pool} />}
        {tab === 'pool_assignments' && <AssignmentsDatatable data={pool.assignments || []} />}
        {tab === 'equipment' && (
          <EquipmentTab equipment={pool.equipment || null} poolId={pool.id} clientId={clientId} />
        )}
      </div>
    </div>
  );
}

export default function PoolHeader({ pools, clientId }: { pools: Pool[]; clientId: string }) {
  return pools.map((pool) => <PoolCard clientId={clientId} key={pool.id} services={pool.services || []} pool={pool} />);
}
