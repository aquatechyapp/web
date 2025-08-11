import { useState } from 'react';
import { BasicDataTable } from '@/components/basic-datatable';
import { columns } from './columns';
import { Service } from '@/ts/interfaces/Service';
import { Pool } from '@/ts/interfaces/Pool';
import { ModalViewService } from '../ModalViewService';
import { BasicServicesDataTable } from '@/components/basic-services-datatable';

export type ServicesDatatableProps = {
  services: Service[];
  pool: Pool;
};

export default function ServicesDatatable({ services, pool }: ServicesDatatableProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);

  // Sort services by scheduledTo date (most recent first)
  const sortedServices = [...services].sort((a, b) => {
    const dateA = new Date(a.scheduledTo);
    const dateB = new Date(b.scheduledTo);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      <BasicServicesDataTable
        columns={columns}
        data={sortedServices}
        onRowClick={(row) => {
          setSelectedService(row.original);
          setOpen(true);
        }}
      />

      {selectedService && <ModalViewService service={selectedService} pool={pool} open={open} setOpen={setOpen} />}
    </>
  );
}
