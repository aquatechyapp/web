import { useState } from 'react';

import { BasicServicesDataTable } from '@/components/basic-services-datatable';
import { Service } from '@/ts/interfaces/Service';
import { Pool } from '@/ts/interfaces/Pool';
import { columns } from '../components/services-datatable/columns';
import { ModalViewService } from '../components/ModalViewService';

interface ServicesTabProps {
  services: Service[];
  pool: Pool;
}

export default function ServicesTab({ services, pool }: ServicesTabProps) {
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
