import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '@/components/ui/use-toast';
import { useAssignmentsContext } from '@/context/assignments';
import { clientAxios } from '@/lib/clientAxios';
import { Assignment, TransferAssignment } from '@/ts/interfaces/Assignments';
import { WeekdaysUppercase } from '@/ts/interfaces/Weekday';

type TransferAssignments = {
  assignmentToId: string;
  weekday: WeekdaysUppercase;
  paidByService?: number | null;
};

type TransferAssignmentsOnce = TransferAssignments & {
  onlyAt?: Date;
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
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error creating assignment',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        duration: 2000,
        title: 'Assignment transferred successfully',
        variant: 'success'
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
    mutationFn: (form: TransferAssignment) => {
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
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error creating assignment',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        duration: 2000,
        title: 'Assignment transferred successfully',
        variant: 'success'
      });
    }
  });
  return { mutate, isPending };
};
