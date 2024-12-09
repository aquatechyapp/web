import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SubcontractorStatus } from '@/ts/enums/enums';
import { getInitials } from '@/utils/others';

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
  type: 'employer' | 'subcontractor' | 'owner';
  status: SubcontractorStatus;
  workRelationId?: string;
};

export function WorkRelationCard({ email, phone, name, type, status, workRelationId }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: handleAcceptInvite } = useMutation({
    mutationFn: async () =>
      await clientAxios.patch('/workrelations/accept', {
        workRelationId,
        newStatus: 'Active'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        duration: 2000,
        title: 'Invite accepted successfully',
        variant: 'success'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error accepting invite',
        variant: 'error'
      });
    }
  });

  return (
    <div className="relative inline-flex w-96 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 md:w-56">
      {workRelationId ? (
        <DropdownMenuWorkRelation workRelationId={workRelationId} isAccepted={status === SubcontractorStatus.Active} />
      ) : null}
      <div className="flex h-[138px] flex-col items-center justify-start gap-4 self-stretch">
        <Avatar className="size-24">
          <AvatarImage src={''} />
          <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex h-[42px] flex-col items-center justify-center gap-1 self-stretch">
          <div className="self-stretch text-center text-sm font-semibold text-gray-800">{name}</div>
          <div className="self-stretch text-center text-xs font-normal leading-[18px] text-gray-500">
            {type === 'subcontractor' ? 'Technician' : type === 'employer' ? 'Employer' : 'Owner'}
          </div>
        </div>
      </div>
      {status === SubcontractorStatus.Inactive && type === 'employer' && (
        <ModalAcceptInvite handleSubmit={handleAcceptInvite}>
          <Button className="h-7 animate-bounce rounded-full bg-orange-500 px-2 py-1 text-sm text-gray-50 hover:bg-orange-600">
            Accept invite
          </Button>
        </ModalAcceptInvite>
      )}
      {status === SubcontractorStatus.Inactive && type === 'subcontractor' && (
        <div className="mt-2 rounded-full bg-orange-500 px-2 py-1 text-sm text-white">Pending Approval</div>
      )}
      {status === SubcontractorStatus.Active && (
        <div className="mt-2 rounded-full bg-green-500 px-2 py-1 text-sm text-gray-50">Active</div>
      )}
      <Separator />
      <div className="flex h-[46px] flex-col items-center justify-center gap-2.5 self-stretch">
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">E-mail</div>
          <div className="h-[18px] w-fit max-w-36 shrink grow basis-0 overflow-hidden text-ellipsis text-right text-xs font-medium leading-[18px] text-gray-400">
            {email}
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">Phone</div>
          <div className="shrink grow basis-0 text-right text-xs font-medium leading-[18px] text-gray-400">{phone}</div>
        </div>
      </div>
    </div>
  );
}
