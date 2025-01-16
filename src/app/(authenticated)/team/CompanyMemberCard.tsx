import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { getInitials } from '@/utils/others';

import { Separator } from '../../../components/ui/separator';

import { CompanyMember } from '@/ts/interfaces/Company';

import DropdownMenuCompanyMember from './DropdownMenuCompanyMember';

export function CompanyMemberCard({ status, company, id, firstName, lastName, email, phone, role }: CompanyMember) {
  return (
    <div className="relative inline-flex w-96 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 md:w-56">
      {id ? (
        <DropdownMenuCompanyMember
          status={status}
          company={company}
          id={id}
          role={role}
          email={email}
          phone={phone}
          firstName={firstName}
          lastName={lastName}
        />
      ) : null}
      <div className="flex h-[138px] flex-col items-center justify-start gap-4 self-stretch">
        <Avatar className="size-24">
          <AvatarImage src={''} />
          <AvatarFallback className="text-2xl">{getInitials(`${firstName} ${lastName}`)}</AvatarFallback>
        </Avatar>

        {firstName === '' ? (
          <div className="flex h-[42px] flex-col items-center justify-center gap-1 self-stretch">
            <div className="self-stretch overflow-hidden text-center text-sm font-semibold text-gray-800">{`${email}`}</div>
          </div>
        ) : (
          <div className="flex h-[42px] flex-col items-center justify-center gap-1 self-stretch">
            <div className="self-stretch text-center text-sm font-semibold text-gray-800">{`${firstName} ${lastName}`}</div>
          </div>
        )}
      </div>
      {/* {status === SubcontractorStatus.Inactive && type === 'employer' && (
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
      )} */}
      <Separator />
      <div className="flex h-fit flex-col items-center justify-center gap-2.5 self-stretch">
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">Company</div>
          <div className="h-[18px] w-fit max-w-36 shrink grow basis-0 overflow-hidden text-ellipsis text-right text-xs font-medium leading-[18px] text-gray-400">
            {company.name}
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">Role</div>
          <div className="h-[18px] w-fit max-w-36 shrink grow basis-0 overflow-hidden text-ellipsis text-right text-xs font-medium leading-[18px] text-gray-400">
            {role}
          </div>
        </div>
        {firstName !== '' ? (
          <div className="inline-flex w-full items-center justify-start gap-1 self-stretch">
            <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">Name</div>
            <div className="h-[18px] w-fit max-w-36 shrink grow basis-0 overflow-hidden text-ellipsis text-end text-xs font-medium leading-[18px] text-gray-400">
              {`${firstName} ${lastName}`}
            </div>
          </div>
        ) : null}

        <div className="inline-flex w-full items-center justify-start gap-1 self-stretch">
          <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">Status</div>
          <div className="h-[18px] w-fit max-w-36 shrink grow basis-0 overflow-hidden text-ellipsis text-end text-xs font-medium leading-[18px] text-gray-400">
            {status}
          </div>
        </div>

        {status === 'Active' ? (
          <div className="inline-flex items-center justify-start gap-1 self-stretch">
            <div className="w-14 text-xs font-normal leading-[18px] text-gray-500">Phone</div>
            <div className="shrink grow basis-0 text-right text-xs font-medium leading-[18px] text-gray-400">
              {phone}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
