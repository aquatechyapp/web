'use client';

import { format } from 'date-fns';
import { useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useDeactivateClient } from '@/hooks/react-query/clients/deactivateClient';

import { Company } from '@/ts/interfaces/Company';
import CompanyInfo from './CompanyInfo';
import Preferences from './Preferences';

type Props = {
  company: Company;
};

export default function ShowCompany({ company }: Props) {
  const [open, setOpen] = useState(false);

  // const { mutate: mutateAddPool } = useAddPoolToClient();
  const [tab, setTab] = useState<'company_info' | 'preferences'>('company_info');

  const { mutate: deactivateClient, isPending } = useDeactivateClient();

  if (isPending) return <LoadingSpinner />;

  const selectedTabStyles = 'text-gray-800 font-semibold';

  return (
    <div>
      <div className="flex flex-col items-start gap-6 self-stretch pt-2 lg:flex-row lg:pt-0">
        <div className="w-full lg:max-w-sm">
          <div className="relative flex w-full flex-col items-center justify-start gap-6 text-nowrap rounded-lg border px-6 pb-6 pt-16">
            <div className="w-[100% - 16px] absolute left-2 right-2 top-2 h-[148px] rounded bg-gradient-to-b from-sky-400 to-teal-400" />

            <div className="PhotoName flex h-[206px] flex-col items-center justify-start gap-3 self-stretch">
              <Avatar className="h-[140px] w-[140px]">
                <AvatarImage src={''} />
                <AvatarFallback className="text-xl">logo</AvatarFallback>
              </Avatar>
              <div className="flex h-[54px] flex-col items-center justify-center gap-1 self-stretch">
                <div className="z-10 self-stretch text-wrap text-center text-xl font-semibold leading-[30px] text-gray-800">
                  {company.name}
                </div>
                <div className="text-sm font-medium text-gray-500">{company.address}</div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap items-start justify-start gap-[18px] self-start lg:flex-col lg:flex-nowrap">
              <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="self-stretch text-sm font-medium text-gray-500">Email</div>
                  <div className="self-stretch text-sm font-medium text-gray-800">{company.email}</div>
                </div>
              </div>
              <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="self-stretch text-sm font-medium text-gray-500">Phone Number</div>
                  <div className="self-stretch text-sm font-medium text-gray-800">{company.phone}</div>
                </div>
              </div>
              {/* <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="self-stretch text-sm font-medium text-gray-500">Locations</div>
                  <div className="self-stretch text-sm font-medium text-gray-800">
                    {client.pools.length > 0
                      ? client.pools.length === 1
                        ? '1 Pool'
                        : `${client.pools.length} Pools`
                      : 'No Pools'}
                  </div>
                </div>
              </div> */}
              {/* <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="self-stretch text-sm font-medium text-gray-500">Last Service</div>
                  <div className="self-stretch text-sm font-medium text-gray-800">
                    {client.lastServiceDate != undefined
                      ? format(new Date(client.lastServiceDate), 'MMMM, dd, yyyy')
                      : 'No Services'}
                  </div>
                </div>
              </div> */}
              <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="text-sm font-medium text-gray-500">Joined</div>
                  <div className="text-sm font-medium text-gray-800">
                    {format(new Date(company.createdAt), 'MMMM, dd, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="inline-flex h-full w-full flex-col items-start justify-start gap-6">
            <div className="inline-flex flex-wrap items-start justify-start gap-6 self-stretch text-nowrap md:flex-nowrap">
              <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
                <div className="inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="self-stretch text-base font-medium leading-normal text-gray-500">
                      Monthly revenue
                    </div>
                    <div className="self-stretch text-[28px] font-semibold text-gray-800">$3670</div>
                  </div>
                  <div className="CircleIconBagde flex h-10 w-10 items-center justify-center gap-2 rounded-[100px] bg-gradient-to-b from-orange-500 to-yellow-400 p-2">
                    <div className="AttachMoney relative h-[18px] w-[18px]" />
                  </div>
                </div>
              </div>
              <div className="RightBadgeStatisticCard inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
                <div className="TitleNumbers inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="TitleNumbers inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="self-stretch text-base font-medium leading-normal text-gray-500">Title</div>
                    <div className="self-stretch text-[28px] font-semibold text-gray-800">Description</div>
                  </div>
                  <div className="CircleIconBagde flex h-10 w-10 items-center justify-center gap-2 rounded-[100px] bg-gradient-to-b from-blue-600 to-sky-400 p-2">
                    <div className="FiSrTimeAdd relative h-[18px] w-[18px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex items-start justify-start gap-4 self-stretch border-b border-gray-200">
              <div
                onClick={() => setTab('company_info')}
                className="inline-flex flex-col items-start justify-start gap-2.5"
              >
                <div
                  className={`text-sm text-gray-500 hover:cursor-pointer ${tab === 'company_info' && selectedTabStyles}`}
                >
                  Basic Information
                </div>
                {tab === 'company_info' && <div className="Rectangle2 h-0.5 self-stretch bg-gray-800" />}
              </div>
              <div
                onClick={() => setTab('preferences')}
                className="inline-flex flex-col items-start justify-start gap-2.5"
              >
                <div
                  className={`text-sm text-gray-500 hover:cursor-pointer ${tab === 'preferences' && selectedTabStyles}`}
                >
                  Preferences
                </div>
                {tab === 'preferences' && <div className="h-0.5 self-stretch bg-gray-800" />}
              </div>
            </div>
            {tab === 'company_info' ? (
              <CompanyInfo company={company} />
            ) : (
              // <PoolHeader pools={client.pools} clientId={client.id} />
              <Preferences params={{ companyId: company.id }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
