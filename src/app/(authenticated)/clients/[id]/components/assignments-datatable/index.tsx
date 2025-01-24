import { BasicDataTable } from '@/components/basic-datatable';
import { columns, PoolAssignmentsPopulated } from './columns';
import { Assignment } from '@/ts/interfaces/Assignments';
import { clientAxios } from '@/lib/clientAxios';
import { useQuery } from '@tanstack/react-query';

export type AssignmentsDatatableProps = {
  data: Assignment[];
};

const getUserByIdFn = async (userId: string) => {
  const response = await clientAxios.get(`/users/${userId}`);
  return response.data.data.user;
};

const getPopulatedData = async (data: Assignment[]) =>
  await Promise.all(
    data.map(async (assignment) => {
      const user = await getUserByIdFn(assignment.assignmentToId);
      return {
        ...assignment,
        assignmentToUser: user
      };
    })
  );

export default function AssignmentsDatatable({ data }: AssignmentsDatatableProps) {
  const { data: populatedData } = useQuery<PoolAssignmentsPopulated[]>({
    queryKey: ['assignments-populated'],
    queryFn: () => getPopulatedData(data)
  });

  return <BasicDataTable columns={columns} data={populatedData || []} />;
}
