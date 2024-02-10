import { DataTable } from './DataTable';
import { columns } from './DataTable/columns';

export default function ClientsList({ data }) {
  return <DataTable data={data} columns={columns} />;
}
