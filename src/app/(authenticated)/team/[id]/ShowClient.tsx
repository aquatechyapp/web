'use client';

import { format } from 'date-fns';
import { useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useAddPoolToClient } from '@/hooks/react-query/clients/addPoolToClient';
import { useDeactivateClient } from '@/hooks/react-query/clients/deactivateClient';
import { Client } from '@/ts/interfaces/Client';
import { calculateTotalAssignmentsOfAllPools, calculateTotalMonthlyOfAllPools } from '@/utils';
import { getInitials } from '@/utils/others';

import ClientInfo from './ClientInfo';
import PoolHeader from './PoolHeader';
import { ModalAddPool } from '../../clients/DataTableClients/ModalAddPool';

type Props = {
  client: Client;
};

export default function ShowClient({ client }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate: mutateAddPool } = useAddPoolToClient();
  const [tab, setTab] = useState<'client_info' | 'pools'>('client_info');

  const { mutate: deactivateClient, isPending } = useDeactivateClient();

  if (isPending) return <LoadingSpinner />;

  const selectedTabStyles = 'text-gray-800 font-semibold';

  return (
    <div>
      <div className="flex flex-col items-start gap-6 self-stretch pt-2 lg:flex-row lg:pt-0">
        <div className="lg:max-w-sm">
          <div className="relative flex w-full flex-col items-center justify-start gap-6 text-nowrap rounded-lg border px-6 pb-6 pt-16">
            <div className="w-[100% - 16px] absolute left-2 right-2 top-2 h-[148px] rounded bg-gradient-to-b from-sky-400 to-teal-400" />

            <div className="PhotoName flex h-[206px] flex-col items-center justify-start gap-3 self-stretch">
              <Avatar className="h-[140px] w-[140px]">
                <AvatarImage src={''} />
                <AvatarFallback className="text-5xl">{getInitials(client.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex h-[54px] flex-col items-center justify-center gap-1 self-stretch">
                <div className="z-10 self-stretch text-wrap text-center text-xl font-semibold leading-[30px] text-gray-800">
                  {client.fullName}
                </div>
                <div className="text-sm font-medium text-gray-500">{client.address}</div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap items-start justify-start gap-[18px] self-start lg:flex-col lg:flex-nowrap">
              <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="self-stretch text-sm font-medium text-gray-500">Email</div>
                  <div className="self-stretch text-sm font-medium text-gray-800">{client.email}</div>
                </div>
              </div>
              <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="self-stretch text-sm font-medium text-gray-500">Phone Number</div>
                  <div className="self-stretch text-sm font-medium text-gray-800">{client.phone}</div>
                </div>
              </div>
              <div className="inline-flex w-fit items-start justify-start gap-2">
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
              </div>
              <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="self-stretch text-sm font-medium text-gray-500">Last Service</div>
                  <div className="self-stretch text-sm font-medium text-gray-800">
                    {client.lastServiceDate != undefined
                      ? format(new Date(client.lastServiceDate), 'MMMM, dd, yyyy')
                      : 'No Services'}
                  </div>
                </div>
              </div>
              <div className="inline-flex w-fit items-start justify-start gap-2">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="text-sm font-medium text-gray-500">Joined</div>
                  <div className="text-sm font-medium text-gray-800">
                    {format(new Date(client.createdAt), 'MMMM, dd, yyyy')}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2">
              <div className="flex w-full justify-center gap-2">
                <Button className="w-full" variant={'outline'}>
                  E-mail
                </Button>
                <Button className="w-full" variant={'outline'}>
                  Message
                </Button>
              </div>
              <div className="flex w-full justify-center gap-2">
                <Button className="w-full" onClick={() => deactivateClient(client.id)} variant={'destructive'}>
                  Deactivate Client
                </Button>
                <Button onClick={() => setOpen(true)} className="w-full" variant={'outline'}>
                  Add pool
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <ModalAddPool handleAddPool={mutateAddPool} clientOwnerId={client.id} open={open} setOpen={setOpen} />
                </Dialog>
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
                      Monthly payment
                    </div>
                    <div className="self-stretch text-[28px] font-semibold text-gray-800">
                      ${calculateTotalMonthlyOfAllPools(client.pools)}
                    </div>
                  </div>
                  <div className="CircleIconBagde flex h-10 w-10 items-center justify-center gap-2 rounded-[100px] bg-gradient-to-b from-orange-500 to-yellow-400 p-2">
                    <div className="AttachMoney relative h-[18px] w-[18px]" />
                  </div>
                </div>
              </div>
              <div className="RightBadgeStatisticCard inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
                <div className="TitleNumbers inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="TitleNumbers inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="self-stretch text-base font-medium leading-normal text-gray-500">Services</div>
                    <div className="self-stretch text-[28px] font-semibold text-gray-800">
                      {calculateTotalAssignmentsOfAllPools(client.pools)}
                    </div>
                  </div>
                  <div className="CircleIconBagde flex h-10 w-10 items-center justify-center gap-2 rounded-[100px] bg-gradient-to-b from-blue-600 to-sky-400 p-2">
                    <div className="FiSrTimeAdd relative h-[18px] w-[18px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex items-start justify-start gap-4 self-stretch border-b border-gray-200">
              <div
                onClick={() => setTab('client_info')}
                className="inline-flex flex-col items-start justify-start gap-2.5"
              >
                <div
                  className={`text-sm text-gray-500 hover:cursor-pointer ${tab === 'client_info' && selectedTabStyles}`}
                >
                  Basic Information
                </div>
                {tab === 'client_info' && <div className="Rectangle2 h-0.5 self-stretch bg-gray-800" />}
              </div>
              <div onClick={() => setTab('pools')} className="inline-flex flex-col items-start justify-start gap-2.5">
                <div className={`text-sm text-gray-500 hover:cursor-pointer ${tab === 'pools' && selectedTabStyles}`}>
                  Pools
                </div>
                {tab === 'pools' && <div className="h-0.5 self-stretch bg-gray-800" />}
              </div>
            </div>
            {tab === 'client_info' ? (
              <ClientInfo client={client} />
            ) : (
              <PoolHeader pools={client.pools} clientId={client.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
