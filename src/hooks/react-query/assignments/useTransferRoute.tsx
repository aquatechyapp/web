import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { useAssignmentsContext } from '@/context/assignments';
import { Assignment } from '@/interfaces/Assignments';
import { WeekdaysUppercase } from '@/interfaces/Weekday';
import { clientAxios } from '@/lib/clientAxios';

type TransferAssignments = {
  assignmentToId: string;
  weekday: WeekdaysUppercase;
  paidByService?: number | null;
};

type TransferAssignmentsOnce = TransferAssignments & {
  onlyAt?: string;
};

type TransferAssignmentsPermanently = TransferAssignments & {
  startOn: string;
  endAfter: string;
};

async function transferOnce(data: Partial<Assignment>[]) {
  const response = await clientAxios.post('/assignments/transferonce', data);
  return response.data;
}

async function transferPermanently(data: Partial<Assignment>[]) {
  const response = await clientAxios.post('/assignments/transferpermanently', data);
  return response.data;
}

export const useTransferOnceRoute = (assignmentToTransfer: Assignment | undefined) => {
  const { assignments } = useAssignmentsContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const assignmentsToTransfer: Assignment[] = assignmentToTransfer ? [assignmentToTransfer] : assignments.current;

  const { mutate, isPending } = useMutation({
    mutationFn: (form: TransferAssignmentsOnce) => {
      const assignments = assignmentsToTransfer!
        .filter((a) => a.frequency !== 'ONCE')
        .map((assignment) => {
          return {
            assignmentId: assignment.id,
            ...form
          };
        });
      return transferOnce(assignments as Partial<Assignment>[]);
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error creating assignment',
        className: 'bg-red-500 text-gray-50'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        duration: 2000,
        title: 'Assignment transferred successfully',
        className: 'bg-green-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};

export const useTransferPermanentlyRoute = (assignmentToTransfer: Assignment | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { assignments } = useAssignmentsContext();
  const assignmentsToTransfer: Assignment[] = assignmentToTransfer ? [assignmentToTransfer] : assignments.current;

  const { mutate, isPending } = useMutation({
    mutationFn: (form: TransferAssignmentsPermanently) => {
      const assignments = assignmentsToTransfer!
        .filter((a) => a.frequency !== 'ONCE')
        .map((assignment) => {
          return {
            ...assignment,
            ...form,
            assignmentId: assignment.id
          };
        });
      return transferPermanently(assignments);
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error creating assignment',
        className: 'bg-red-500 text-gray-50'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        duration: 2000,
        title: 'Assignment transferred successfully',
        className: 'bg-green-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
