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

  return (
    <>
      <BasicServicesDataTable
        columns={columns}
        data={services}
        onRowClick={(row) => {
          setSelectedService(row.original);
          setOpen(true);
        }}
      />

      {selectedService && <ModalViewService service={selectedService} pool={pool} open={open} setOpen={setOpen} />}
    </>
  );
}
