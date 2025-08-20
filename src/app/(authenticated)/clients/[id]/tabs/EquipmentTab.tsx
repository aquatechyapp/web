import { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { useUpdateFilter } from '@/hooks/react-query/pools/updateFilter';
import { Equipment } from '@/ts/interfaces/Pool';
import { FieldType } from '@/ts/enums/enums';

interface EquipmentTabProps {
  equipment: Equipment | null;
  poolId: string;
  clientId: string;
}

export default function EquipmentTab({
  equipment,
  poolId,
  clientId
}: EquipmentTabProps) {
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
