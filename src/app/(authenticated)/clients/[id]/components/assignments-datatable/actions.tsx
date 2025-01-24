import CancelAssignmentDialog from './remove-dialog';
import { PoolAssignmentsPopulated } from './columns';
import TransferAssignmentDialog from './transfer-dialog';

export type AssignmentsDatatableActionsProps = {
  data: PoolAssignmentsPopulated;
};

export default function AssignmentsDatatableActions({ data }: AssignmentsDatatableActionsProps) {
  return (
    <div className="flex w-full flex-row items-center justify-center gap-2">
      <TransferAssignmentDialog data={data} />
      <CancelAssignmentDialog assignmentId={data.id} />
    </div>
  );
}
