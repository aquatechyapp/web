import { BasicDataTable } from '@/components/basic-datatable';
import { columns, PoolAssignmentsPopulated } from './columns';
import { Assignment } from '@/ts/interfaces/Assignments';
import { clientAxios } from '@/lib/clientAxios';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export type AssignmentsDatatableProps = {
  data: Assignment[];
  onLoadingComplete?: () => void;
};

const getUserByIdFn = async (userId: string) => {
  const response = await clientAxios.get(`/users/${userId}`);
  return response.data.data.user;
};

const getPopulatedData = async (data: Assignment[]) => {
  if (!data || data.length === 0) return [];

  return await Promise.all(
    data.map(async (assignment) => {
      const user = await getUserByIdFn(assignment.assignmentToId);
      return {
        ...assignment,
        assignmentToUser: user
      };
    })
  );
};

export default function AssignmentsDatatable({ data, onLoadingComplete }: AssignmentsDatatableProps) {
  const {
    data: populatedData,
    isLoading,
    isSuccess,
    isError
  } = useQuery<PoolAssignmentsPopulated[]>({
    queryKey: ['assignments-populated', data.map((a) => a.id)],
    queryFn: () => getPopulatedData(data),
    enabled: true,
    retry: false,
    staleTime: 30000
  });

  useEffect(() => {
    if (!isLoading) {
      onLoadingComplete?.();
    }
  }, [isLoading, onLoadingComplete]);

  return <BasicDataTable columns={columns} data={populatedData || []} isLoading={isLoading} />;
}
