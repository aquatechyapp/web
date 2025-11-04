import { BasicDataTable } from '@/components/basic-datatable';
import { Pool } from '@/ts/interfaces/Pool';
import { columns } from '../components/assignments-datatable/columns';
import { useGetAssignmentsByPool } from '@/hooks/react-query/assignments/useGetAssignmentsByPool';

interface AssignmentsTabProps {
  pool: Pool;
  clientId: string;
}

export default function AssignmentsTab({ pool, clientId }: AssignmentsTabProps) {
  const { assignments, isLoading } = useGetAssignmentsByPool(pool.id);

  return (
    <BasicDataTable columns={columns} data={assignments || []} isLoading={isLoading} />
  );
}

