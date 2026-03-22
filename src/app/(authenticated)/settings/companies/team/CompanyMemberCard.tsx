import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { getInitials } from '@/utils/others';

import { Separator } from '../../../../../components/ui/separator';

import { CompanyMember } from '@/ts/interfaces/Company';

import DropdownMenuCompanyMember from './DropdownMenuCompanyMember';

type Props = CompanyMember & {
  hideCompanyRow?: boolean;
};

export function CompanyMemberCard({
  status,
  company,
  id,
  firstName,
  lastName,
  email,
  phone,
  role,
  address,
  city,
  state,
  zip,
  hideCompanyRow = false
}: Props) {
  return (
    <div className="relative flex w-full cursor-pointer flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 md:w-80">
      {id && (
        <DropdownMenuCompanyMember
          status={status}
          company={company}
          id={id}
          role={role}
          email={email}
          phone={phone}
          firstName={firstName}
          lastName={lastName}
          address={address}
          city={city}
          state={state}
          zip={zip}
        />
      )}

      <div className="flex flex-col items-center justify-start gap-4 w-full">
        <Avatar className="size-24">
          <AvatarImage src={''} />
          <AvatarFallback className="text-2xl">{getInitials(`${firstName} ${lastName}`)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center justify-center gap-1 w-full">
          <div className="text-center text-sm font-semibold text-gray-800 truncate w-full">
            {firstName ? `${firstName} ${lastName}` : email}
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2 w-full">
        {!hideCompanyRow && (
          <div className="flex w-full justify-between text-xs text-gray-500">
            <span>Company</span>
            <span className="truncate text-right text-gray-400">{company.name}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-500 w-full">
          <span>Role</span>
          <span className="text-gray-400 truncate text-right">{role}</span>
        </div>

        {firstName && (
          <div className="flex justify-between text-xs text-gray-500 w-full">
            <span>Name</span>
            <span className="text-gray-400 truncate text-right">{`${firstName} ${lastName}`}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-500 w-full">
          <span>Status</span>
          <span className="text-gray-400 truncate text-right">{status}</span>
        </div>

        {status === 'Active' && (
          <div className="flex justify-between text-xs text-gray-500 w-full">
            <span>Phone</span>
            <span className="text-gray-400 truncate text-right">{phone}</span>
          </div>
        )}
      </div>
    </div>

  );
}
