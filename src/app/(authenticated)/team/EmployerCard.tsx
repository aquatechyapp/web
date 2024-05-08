import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import DropdownMenuWorkRelation from './DropdownMenuWorkRelation';
import { ModalAcceptInvite } from './ModalAcceptInvite';

type Props = {
  email: string;
  phone: string;
  name: string;
  workRelationId: string;
  status: string;
};

export function EmployerCard({ email, phone, name, workRelationId, status }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate: handleSubmit } = useMutation({
    mutationFn: async () =>
      await clientAxios.patch('/workrelations', {
        workRelationId,
        newStatus: 'Active'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        variant: 'default',
        title: 'Invite Active successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        variant: 'default',
        title: 'Error accepting invite',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });

  return (
    <div className="relative inline-flex w-56 flex-col items-center justify-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <DropdownMenuWorkRelation workRelationId={workRelationId} />
      <div className="flex h-[138px] flex-col items-center justify-start gap-4 self-stretch">
        <img className="h-20 w-20 rounded-[100px]" src="https://via.placeholder.com/80x80" />
        <div className="flex h-[42px] flex-col items-center justify-center gap-1 self-stretch">
          <div className="self-stretch text-center text-sm font-semibold   text-gray-800">{name}</div>
          <div className="self-stretch text-center text-xs font-normal leading-[18px]  text-gray-500">Company</div>
        </div>
      </div>
      {status === 'Inactive' && (
        <ModalAcceptInvite handleSubmit={handleSubmit}>
          <Button className="h-7 animate-bounce rounded-full bg-orange-500 px-2 py-1 text-sm text-gray-50 hover:bg-orange-600">
            Accept invite
          </Button>
        </ModalAcceptInvite>
      )}
      {status === 'Active' && <div className="rounded-full bg-green-500 px-2 py-1 text-sm text-gray-50">Active</div>}
      <Separator />
      <div className="flex h-[46px] flex-col items-center justify-center gap-2.5 self-stretch">
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px]  text-gray-500">E-mail</div>
          <div className="h-[18px] shrink grow basis-0 text-right text-xs font-medium leading-[18px]  text-gray-400">
            {email}
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px]  text-gray-500">Phone</div>
          <div className="shrink grow basis-0 text-right text-xs font-medium leading-[18px]  text-gray-400">
            {phone}
          </div>
        </div>
      </div>
    </div>
  );
}
