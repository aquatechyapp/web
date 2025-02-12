import { BasicDataTable } from '@/components/basic-datatable';
import { columns } from './columns';
import { Service } from '@/ts/interfaces/Service';

export type ServicesDatatableProps = {
  data: Service[];
};

export default function ServicesDatatable({ data }: ServicesDatatableProps) {
  return <BasicDataTable columns={columns} data={data} />;
}
