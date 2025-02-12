'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format, set } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useWindowDimensions from '@/hooks/useWindowDimensions';

import { useMembersStore } from '@/store/members';
import { useUserStore } from '@/store/user';
import { normalizeToUTC12, useWeekdayStore } from '@/store/weekday';

import Map from './Map';

import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';

import MemberSelect from './MemberSelect';
import { ServicesList } from './ServicesList';
import { useServicesContext } from '@/context/services';
import { Service } from '@/ts/interfaces/Service';
import { newServiceSchema } from '@/schemas/service';
import { useMapServicesUtils } from '@/hooks/useMapServicesUtils';
import { DialogNewService } from './ModalNewService';
import { normalize } from 'quill/modules/keyboard';

export default function Page() {
  const { directions, distance, duration, isLoaded, loadError, getDirectionsFromGoogleMaps } = useMapServicesUtils();
  const [openTransferDialog, setOpenTransferDialog] = useState(false);

  const { services, setServices } = useServicesContext();
  const { selectedDay, setSelectedDay } = useWeekdayStore((state) => state);
  const { width = 0 } = useWindowDimensions();

  const router = useRouter();

  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      isFreePlan: state.isFreePlan
    }))
  );

  useGetMembersOfAllCompaniesByUserId(user.id);

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  const { assignedToId, setAssignedToid } = useMembersStore(
    useShallow((state) => ({
      assignedToId: state.assignedToId,
      setAssignedToid: state.setAssignedToid
    }))
  );

  const mdScreen = width < 900;

  const form = useForm<z.infer<typeof newServiceSchema>>({
    resolver: zodResolver(newServiceSchema),
    defaultValues: {
      assignedToId: assignedToId,
      poolId: '',
      scheduledTo: ''
    }
  });

  function getDifference(array1: Service[], array2: Service[]): boolean {
    return JSON.stringify(array1) !== JSON.stringify(array2);
  }

  function handleChangeMember(memberId: string) {
    setAssignedToid(memberId);
    form.setValue('assignedToId', memberId);
  }

  function getNext7DatesWith12PMUTC(): { date: string; formatted: string }[] {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const dateAt12PMUTC = normalizeToUTC12(addDays(today, index).toISOString());
      return {
        date: dateAt12PMUTC.toISOString(),
        formatted: format(dateAt12PMUTC, 'MM/dd') // '02/12'
      };
    });
  }

  function handleChangeDay(day: string) {
    setSelectedDay(day);
  }

  const next7days = getNext7DatesWith12PMUTC();

  return (
    <FormProvider {...form}>
      <div
        className={`flex h-[100%] w-full items-start justify-start gap-2 bg-gray-50 p-2 ${mdScreen ? 'flex-col' : ''}`}
      >
        <div className={`w-[50%] ${mdScreen && 'w-full'}`}>
          <Tabs
            onValueChange={handleChangeDay}
            defaultValue={selectedDay || getNext7DatesWith12PMUTC()[0].date}
            value={selectedDay}
            className="w-full"
          >
            <div className="inline-flex w-full flex-col items-center justify-start gap-2 rounded-lg bg-gray-50 py-2">
              <Form {...form}>
                <form className="w-full">
                  <TabsList className="grid h-12 w-full grid-cols-7">
                    {next7days.map((day, index) => (
                      <TabsTrigger
                        className="px-0 text-xs data-[state=active]:px-0"
                        key={day.formatted}
                        value={day.date}
                      >
                        {day.formatted}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <MemberSelect onChange={handleChangeMember} />
                  <DialogNewService />
                </form>
              </Form>

              <TabsContent value={selectedDay || getNext7DatesWith12PMUTC()[0].date} className="w-full">
                <ServicesList />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className={`h-fit w-[50%] ${mdScreen && 'w-full'}`}>
          <Map
            services={services}
            directions={directions}
            distance={distance}
            duration={duration}
            isLoaded={isLoaded}
            loadError={loadError}
          />
        </div>
      </div>
    </FormProvider>
  );
}

export type FormSchema = z.infer<typeof newServiceSchema>;
