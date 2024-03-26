'use client';

import { useState } from 'react';
import ClientInfo from './ClientInfo';
import PoolHeader from './PoolHeader';
import { format } from 'date-fns';
import {
  calculateTotalAssignmentsOfAllPools,
  calculateTotalMonthlyOfAllPools
} from '@/utils';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema } from '@/schemas/client';
import { poolSchema } from '@/schemas/pool';
import { Button } from '@/app/_components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/_components/ui/avatar';
import { useDeactivateClient } from '@/hooks/react-query/clients/deactivateClient';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';

const additionalSchemas = z.object({
  weekday: z.enum(
    [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ],
    {
      required_error: 'Weekday is required.',
      invalid_type_error: 'Weekday is required.'
    }
  ),
  frequency: z.string(z.enum(['MONTHLY', 'TRIWEEKLY', 'BIWEEKLY', 'WEEKLY'])),
  sameBillingAddress: z.boolean(),
  startOn: z.coerce.date(),
  endAfter: z.coerce.date(),
  assignmentToId: z.string()
});

const poolAndClientSchema = clientSchema.and(poolSchema).and(additionalSchemas);

export default function ShowClient({ client }) {
  const [tab, setTab] = useState<'client_info' | 'pools'>('client_info');
  const form = useForm<z.infer<typeof poolAndClientSchema>>({
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      clientCity: client.city || '',
      clientState: client.state || '',
      clientZip: client.zip || '',
      email1: client.email1 || '',
      phone1: client.phone1 || '',
      clientNotes: client.notes || null,
      clientAddress: client.address || '',
      clientName: client.name || ''
    }
  });
  const { mutate: deactivateClient, isPending } = useDeactivateClient();

  if (isPending) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-start gap-6 self-stretch">
        <div className="LeftCol inline-flex  w-[387px] flex-col items-start justify-start gap-7">
          <div className="UserDetail relative flex h-[698px] flex-col items-center justify-start gap-6 rounded-lg border border-zinc-200 bg-white px-6 pb-6 pt-16">
            <div className="w-[100% - 16px] absolute left-2 right-2 top-2 h-[148px] rounded bg-gradient-to-b from-sky-400 to-teal-400" />

            <div className="PhotoName flex h-[206px] flex-col items-center justify-start gap-3 self-stretch">
              <Avatar className="h-[140px] w-[140px]">
                <AvatarImage
                  src={
                    client.pools[0].photos[0] ||
                    'https://via.placeholder.com/140x140'
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="NameStatus flex h-[54px] flex-col items-center justify-center gap-1 self-stretch">
                <div className="Text font-['Public Sans'] self-stretch text-center text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
                  {client.name}
                </div>
                <div className="BillingAddress font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-gray-500">
                  {client.address}
                </div>
              </div>
            </div>
            <div className="Details flex flex-col items-center justify-start gap-[18px]">
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrEnvelope relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Email
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    {client.email1}
                  </div>
                </div>
                <div className="Action flex items-center justify-center gap-2">
                  <div className="Icon flex h-[18px] w-[18px] items-center justify-center gap-2 p-2">
                    <div className="FiSrCopy relative h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrSmartphone relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Phone Number
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    {client.phone1}
                  </div>
                </div>
                <div className="Action flex items-center justify-center gap-2">
                  <div className="Icon flex h-[18px] w-[18px] items-center justify-center gap-2 p-2">
                    <div className="FiSrCopy relative h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrFileCheck relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Locations
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    {client.pools.length > 0
                      ? client.pools.length === 1
                        ? '1 Pool'
                        : `${client.pools.length} Pools`
                      : 'No Pools'}
                  </div>
                </div>
              </div>
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrTimeCheck relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Last Service
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    {client.lastService != undefined
                      ? format(new Date(client.lastService), 'MMMM, dd, yyyy')
                      : 'No Services'}
                  </div>
                </div>
              </div>
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrCalendar relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Joined
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    {format(new Date(client.createdAt), 'MMMM, dd, yyyy')}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center flex-col w-52 gap-2">
              <div className="w-full flex justify-center gap-2">
                <Button className="w-full" variant={'outline'}>
                  E-mail
                </Button>
                <Button className="w-full" variant={'outline'}>
                  Message
                </Button>
              </div>
              <div className="w-full">
                <Button
                  onClick={() => deactivateClient(client.id)}
                  className="w-full"
                  variant={'destructive'}
                >
                  Deactivate Client
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start  gap-7">
          <div className="RightCol inline-flex h-[827px]  w-full flex-col items-start justify-start gap-7">
            <div className="Row inline-flex items-start justify-start gap-6 self-stretch">
              <div className="RightBadgeStatisticCard inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-5">
                <div className="TitleNumbers inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="TitleNumbers inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="Text font-['Public Sans'] self-stretch text-base font-medium leading-normal tracking-tight text-zinc-500">
                      Monthly payment
                    </div>
                    <div className="Text font-['Public Sans'] self-stretch text-[28px] font-semibold tracking-tight text-neutral-800">
                      {calculateTotalMonthlyOfAllPools(client.pools)}
                    </div>
                  </div>
                  <div className="CircleIconBagde flex h-10 w-10 items-center justify-center gap-2 rounded-[100px] bg-gradient-to-b from-orange-500 to-yellow-400 p-2">
                    <div className="AttachMoney relative h-[18px] w-[18px]" />
                  </div>
                </div>
              </div>
              <div className="RightBadgeStatisticCard inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-5">
                <div className="TitleNumbers inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="TitleNumbers inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="Text font-['Public Sans'] self-stretch text-base font-medium leading-normal tracking-tight text-zinc-500">
                      Services
                    </div>
                    <div className="Text font-['Public Sans'] self-stretch text-[28px] font-semibold tracking-tight text-neutral-800">
                      {calculateTotalAssignmentsOfAllPools(client.pools)}
                    </div>
                  </div>
                  <div className="CircleIconBagde flex h-10 w-10 items-center justify-center gap-2 rounded-[100px] bg-gradient-to-b from-blue-600 to-sky-400 p-2">
                    <div className="FiSrTimeAdd relative h-[18px] w-[18px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="RegularTabs inline-flex items-start justify-start gap-4 self-stretch border-b border-zinc-200">
              <div
                onClick={() => setTab('client_info')}
                className="RegularTab inline-flex flex-col items-start justify-start gap-2.5"
              >
                <div
                  className={`font-['Public Sans'] text-sm font-semibold leading-tight tracking-tight hover:cursor-pointer ${tab === 'client_info' ? 'text-neutral-800' : 'text-gray-500'}`}
                >
                  Basic information
                </div>
                {tab === 'client_info' && (
                  <div className="Rectangle2 h-0.5 self-stretch bg-neutral-800" />
                )}
              </div>
              <div
                onClick={() => setTab('pools')}
                className="RegularTab inline-flex flex-col items-start justify-start gap-2.5"
              >
                <div
                  className={`font-['Public Sans'] text-sm font-medium leading-tight tracking-tight hover:cursor-pointer ${tab === 'pools' ? 'text-neutral-800' : 'text-gray-500'}`}
                >
                  Pools
                </div>
                {tab === 'pools' && (
                  <div className="Rectangle2 h-0.5 self-stretch bg-neutral-800" />
                )}
              </div>
            </div>
            {tab === 'client_info' ? (
              <ClientInfo client={client} />
            ) : (
              <PoolHeader form={form} pools={client.pools} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
