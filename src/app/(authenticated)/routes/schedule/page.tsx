'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Form } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import useWindowDimensions from '@/hooks/useWindowDimensions';

import { useMembersStore } from '@/store/members';
import { useUserStore } from '@/store/user';
import { normalizeToUTC12, useWeekdayStore } from '@/store/weekday';

import Map from './Map';

import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';

import MemberSelect from './MemberSelect';
import { ServicesList } from './ServicesList';
import { useServicesContext } from '@/context/services';
import { newServiceSchema } from '@/schemas/service';
import { useMapServicesUtils } from '@/hooks/useMapServicesUtils';
import { DialogNewService } from './ModalNewService';
import { DialogTransferMultipleServices } from './ModalTransferMultipleServices';
export default function Page() {
  const { directions, distance, duration, isLoaded, loadError, getDirectionsFromGoogleMaps } = useMapServicesUtils();

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
      scheduledTo: '',
      clientId: '',
      serviceTypeId: ''
    }
  });

  function handleChangeMember(memberId: string) {
    setAssignedToid(memberId);
    form.setValue('assignedToId', memberId);
  }

  function getDateRange(): { date: string; formatted: string; displayText: string }[] {
    const today = new Date();

    // Create array from -7 to +21 (29 days total)
    return Array.from({ length: 29 }, (_, index) => {
      // Subtract 7 from index to start 7 days ago
      const dateAt12PMUTC = normalizeToUTC12(addDays(today, index - 7).toISOString());
      const isToday = index === 7; // Today is at index 7 (7 days ago + 7 = today)
      const isPast = index < 7;
      
      const formattedDate = format(dateAt12PMUTC, 'EEEE, MMMM do');
      
      return {
        date: dateAt12PMUTC.toISOString(),
        formatted: formattedDate,
        displayText: isToday 
          ? `Today - ${formattedDate}`
          : isPast 
            ? `${formattedDate}`
            : `${formattedDate}`
      };
    });
  }

  function handleChangeDay(day: string) {
    setSelectedDay(day);
  }

  const dateRange = getDateRange();

  return (
      <FormProvider {...form}>
        <div
          className={`flex h-[100%] w-full items-start justify-start gap-2 bg-gray-50 p-2 ${mdScreen ? 'flex-col' : ''}`}
        >
          <div className={`w-[50%] ${mdScreen && 'w-full'}`}>
            <div className="inline-flex w-full flex-col items-center justify-start gap-2 rounded-lg bg-gray-50 py-2">
              <Form {...form}>
                <form className="w-full">
                  <div className="mb-4">
                    <Select
                      value={selectedDay || getDateRange()[7].date}
                      onValueChange={handleChangeDay}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a date" />
                      </SelectTrigger>
                      <SelectContent>
                        {dateRange.map((day) => (
                          <SelectItem key={day.date} value={day.date}>
                            {day.displayText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <MemberSelect onChange={handleChangeMember} />
                  <div className="flex gap-2 mb-2 mt-2">
                    <DialogNewService />
                    <DialogTransferMultipleServices />
                  </div>
                </form>
              </Form>

              <div className="w-full">
                <ServicesList />
              </div>
            </div>
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
