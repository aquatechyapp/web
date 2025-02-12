import { useQueryClient } from '@tanstack/react-query';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/others';

import { Separator } from '../../../components/ui/separator';
import { useToast } from '../../../components/ui/use-toast';
import DropdownMenuCompany from './DropdownMenuCompany';

type Props = {
  companyId: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  status: string;
};

export function CompanyCard({ companyId, name, email, phone, role, status }: Props) {
  return (
    <div className="relative inline-flex w-96 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 md:w-56">
      {companyId ? <DropdownMenuCompany companyId={companyId} /> : null}
      <div className="flex h-[138px] flex-col items-center justify-start gap-4 self-stretch">
        <Avatar className="size-24">
          <AvatarImage src={''} />
          <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex h-[42px] flex-col items-center justify-center gap-1 self-stretch">
          <div className="self-stretch text-center text-sm font-semibold text-gray-800">{name}</div>
        </div>
      </div>

      <Separator />
      <div className="flex h-[52px] flex-col items-center justify-center gap-2.5 self-stretch">
        {role && (
          <div className="inline-flex items-center justify-start gap-1 self-stretch">
            <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">My role</div>
            <div className="h-[18px] w-fit max-w-36 shrink grow basis-0 overflow-hidden text-ellipsis text-right text-xs font-medium leading-[18px] text-gray-400">
              {role}
            </div>
          </div>
        )}
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
