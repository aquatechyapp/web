'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { ModalDeleteClient } from './modal-delete-client';

export default function ActionButtons({ ...props }) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async () =>
      await clientAxios.delete('/clients', {
        data: { id: props.row.original.id }
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['clients'] });
      // push('/clients');
      toast({
        variant: 'default',
        title: 'Client deleted successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error deleting client',
        className: 'bg-red-500 text-white'
      });
    }
  });
  const handleView = () => {
    push(`/clients/${props.row.original.id}`);
  };
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => handleView()}>
        <IoEyeOutline />
      </Button>
      <ModalDeleteClient handleSubmit={handleSubmit}>
        <Button disabled={isPending} variant="destructive" size="sm">
          <FaRegTrashAlt />
        </Button>
      </ModalDeleteClient>
    </div>
  );
}
