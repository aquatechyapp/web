import { Separator } from '@/app/_components/ui/separator';
import DropdownMenuWorkRelation from './DropdownMenuWorkRelation';

type Props = {
  email: string;
  phone: string;
  name: string;
  type: string;
  status: string;
  workRelationId: string;
};

export function SubcontractorCard({
  email,
  phone,
  name,
  type,
  status,
  workRelationId
}: Props) {
  return (
    <div className="relative inline-flex w-56 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <DropdownMenuWorkRelation workRelationId={workRelationId} />
      <div className="flex h-[138px] flex-col items-center justify-start gap-4 self-stretch">
        <img
          className="h-20 w-20 rounded-[100px]"
          src="https://via.placeholder.com/80x80"
        />
        <div className="flex h-[42px] flex-col items-center justify-center gap-1 self-stretch">
          <div className="font-['Public Sans'] self-stretch text-center text-sm font-semibold leading-tight tracking-tight text-neutral-800">
            {name}
          </div>
          <div className="font-['Public Sans'] self-stretch text-center text-xs font-normal leading-[18px] tracking-tight text-gray-500">
            {type === 'subcontractor' ? 'Technician' : 'Employer'}
          </div>
        </div>
      </div>
      {status === 'NotAccepted' && (
        // <ModalAcceptInvite handleSubmit={handleAcceptWorkRelation}>
        <div className="bg-orange-500 text-white text-sm py-1 px-2 rounded-full opacity-50">
          Not accepted
        </div>
        // </ModalAcceptInvite>
      )}
      {status === 'Accepted' && (
        <div className="bg-green-500 text-white text-sm py-1 px-2 rounded-full">
          Accepted
        </div>
      )}
      <Separator />
      <div className="flex h-[46px] flex-col items-center justify-center gap-2.5 self-stretch">
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="font-['Public Sans'] w-14 text-xs font-normal leading-[18px] tracking-tight text-gray-500">
            E-mail
          </div>
          <div className="font-['Public Sans'] h-[18px] shrink grow basis-0 text-right text-xs font-medium leading-[18px] tracking-tight text-gray-400">
            {email}
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="font-['Public Sans'] w-14 text-xs font-normal leading-[18px] tracking-tight text-gray-500">
            Phone
          </div>
          <div className="font-['Public Sans'] shrink grow basis-0 text-right text-xs font-medium leading-[18px] tracking-tight text-gray-400">
            {phone}
          </div>
        </div>
      </div>
    </div>
  );
}
