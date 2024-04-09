import { Button } from '@/app/_components/ui/button';
import { Separator } from '@/app/_components/ui/separator';
import { clientAxios } from '@/services/clientAxios';
import { ModalAcceptInvite } from './ModalAcceptInvite';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/_components/ui/use-toast';
import DropdownMenuWorkRelation from './DropdownMenuWorkRelation';

type Props = {
  email: string;
  phone: string;
  name: string;
  workRelationId: string;
  status: string;
};

export function EmployerCard({
  email,
  phone,
  name,
  workRelationId,
  status
}: Props) {
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
        className: 'bg-green-500 text-white'
      });
    },
    onError: () => {
      toast({
        variant: 'default',
        title: 'Error accepting invite',
        className: 'bg-red-500 text-white'
      });
    }
  });

  return (
    <div className="relative inline-flex w-56 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <DropdownMenuWorkRelation workRelationId={workRelationId} />
      <div className="flex h-[138px] flex-col items-center justify-start gap-4 self-stretch">
        <img
          className="h-20 w-20 rounded-[100px]"
          src="https://via.placeholder.com/80x80"
        />
        <div className="flex h-[42px] flex-col items-center justify-center gap-1 self-stretch">
          <div className="self-stretch text-center text-sm font-semibold leading-tight tracking-tight text-neutral-800">
            {name}
          </div>
          <div className="self-stretch text-center text-xs font-normal leading-[18px] tracking-tight text-gray-500">
            Company
          </div>
        </div>
      </div>
      {status === 'Inactive' && (
        <ModalAcceptInvite handleSubmit={handleSubmit}>
          <Button className="bg-orange-500 hover:bg-orange-600 h-7 text-white text-sm py-1 px-2 rounded-full animate-bounce">
            Accept invite
          </Button>
        </ModalAcceptInvite>
      )}
      {status === 'Active' && (
        <div className="bg-green-500 text-white text-sm py-1 px-2 rounded-full">
          Active
        </div>
      )}
      <Separator />
      <div className="flex h-[46px] flex-col items-center justify-center gap-2.5 self-stretch">
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] tracking-tight text-gray-500">
            E-mail
          </div>
          <div className="h-[18px] shrink grow basis-0 text-right text-xs font-medium leading-[18px] tracking-tight text-gray-400">
            {email}
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] tracking-tight text-gray-500">
            Phone
          </div>
          <div className="shrink grow basis-0 text-right text-xs font-medium leading-[18px] tracking-tight text-gray-400">
            {phone}
          </div>
        </div>
      </div>
    </div>
  );
}
