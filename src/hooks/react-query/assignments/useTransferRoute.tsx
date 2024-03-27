import { useToast } from '@/app/_components/ui/use-toast';
import { useAssignmentsContext } from '@/context/assignments';
import { Assignment } from '@/interfaces/Assignments';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type TransferOnceObject = {
  assignmentToId: string;
  weekday: string;
  onlyAt: string;
};

type TransferPermanentlyObject = {
  assignmentToId: string;
  weekday: string;
  startOn: string;
  endAfter: string;
};

async function transferOnce(data: Partial<Assignment>[]) {
  const response = await clientAxios.post('/assignments/duplicate', data);
  return response.data;
}

async function transferPermanently(data: Assignment[]) {
  const response = await clientAxios.patch('/assignments', data);
  return response.data;
}

export const useTransferOnceRoute = () => {
  const queryClient = useQueryClient();
  const { assignments } = useAssignmentsContext();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: (form: TransferOnceObject) => {
      const data = assignments.current
        .filter((a) => a.frequency !== 'ONCE')
        .map((assignment) => {
          return {
            assignmentId: assignment.id,
            ...form
          };
        });
      return transferOnce(data);
    },
    onError: () => {
      toast({
        title: 'Error creating assignment',
        className: 'bg-red-500 text-white'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Assignment created successfully',
        className: 'bg-green-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};

export const useTransferPermanentlyRoute = () => {
  const { assignments } = useAssignmentsContext();

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: (form: TransferPermanentlyObject) => {
      const data: Assignment[] = assignments.current
        .filter((a) => a.frequency !== 'ONCE')
        .map((assignment) => {
          return {
            ...assignment,
            ...form,
            assignmentId: assignment.id
          };
        });
      return transferPermanently(data);
    },
    onError: () => {
      toast({
        title: 'Error creating assignment',
        className: 'bg-red-500 text-white'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Assignment created successfully',
        className: 'bg-green-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
