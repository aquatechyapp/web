'use client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AssignmentsProvider, useAssignmentsContext } from '@/context/assignments';

import { useUpdateAssignments } from '@/hooks/react-query/assignments/updateAssignments';
import { useMapAssignmentsUtils } from '@/hooks/useMapAssignmentsUtils';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import { useMembersStore } from '@/store/members';
import { useUserStore } from '@/store/user';
import { useWeekdayStore } from '@/store/weekday';

import { Assignment } from '@/ts/interfaces/Assignments';
import { Weekdays, WeekdaysUppercase } from '@/ts/interfaces/Weekday';

import Map from './Map';
import { AssignmentsList } from './AssignmentsList';
import { DialogNewAssignment } from './ModalNewAssignment';
import MemberSelect from './MemberSelect';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';

import { newAssignmentSchema } from '@/schemas/assignments';
import { OptimizeRouteModal } from './OptimizeRouteModal';
import { DialogTransferCompleteRoute } from './ModalTransferCompleteRoute';

export default function Page() {
  const { directions, distance, duration, isLoaded, loadError, getDirectionsFromGoogleMaps } = useMapAssignmentsUtils();

  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);

  const { assignments, setAssignments } = useAssignmentsContext();
  const { selectedWeekday, setSelectedWeekday } = useWeekdayStore((state) => state);

  const { width = 0 } = useWindowDimensions();
  const { mutate: updateAssignments, isPending: isUpdateAssignmentsPending } = useUpdateAssignments();

  const router = useRouter();

  const { user, isFreePlan } = useUserStore(
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

  const { assignmentToId, setAssignmentToId } = useMembersStore(
    useShallow((state) => ({
      assignmentToId: state.assignmentToId,
      setAssignmentToId: state.setAssignmentToId
    }))
  );

  const form = useForm<z.infer<typeof newAssignmentSchema>>({
    resolver: zodResolver(newAssignmentSchema),
    defaultValues: {
      assignmentToId: assignmentToId,
      poolId: '',
      client: '',
      serviceTypeId: '',
      weekday: format(new Date(), 'EEEE').toUpperCase() as WeekdaysUppercase,
      frequency: 'WEEKLY',
      startOn: undefined,
      endAfter: undefined,
      instructions: ''
    }
  });

  const mdScreen = width < 900;

  function getDifference(array1: Assignment[], array2: Assignment[]): boolean {
    return JSON.stringify(array1) !== JSON.stringify(array2);
  }

  function handleDragEnd(event: DragEndEvent, setActive: React.Dispatch<number | null>) {
    const { active, over } = event;
    setActive(null);
    if (!active || !over) return;
    if (active.id !== over.id) {
      const oldIndex = assignments.current.findIndex((item) => item.id === active.id);
      const newIndex = assignments.current.findIndex((item) => item.id === over.id);

      const changedOrderProperty = arrayMove(assignments.current, oldIndex, newIndex).map((assignment, index) => {
        return { ...assignment, order: index + 1 };
      });

      setAssignments({
        ...assignments,
        current: changedOrderProperty
      });
      getDirectionsFromGoogleMaps(false, 'first', 'last', user.addressCoords!);
    }
  }

  function handleChangeWeekday(weekday: WeekdaysUppercase) {
    form.setValue('weekday', weekday);
    setSelectedWeekday(weekday);
  }

  function handleChangeMember(memberId: string) {
    setAssignmentToId(memberId);
    form.setValue('assignmentToId', memberId);
  }

  const handleOptimize = (origin: 'home' | 'first', destination: 'home' | 'last') => {
    if (assignments.current.length > 0) {

      getDirectionsFromGoogleMaps(true, origin, destination, user.addressCoords!);
      // Add this to ensure the UI updates
      setAssignments({
        ...assignments,
        initial: assignments.current
      });
    }
  };

  if (isUpdateAssignmentsPending) return <LoadingSpinner />;

  return (
    <FormProvider {...form}>
      <div
        className={`flex h-[100%] w-full items-start justify-start gap-2 bg-gray-50 p-2 ${mdScreen ? 'flex-col' : ''}`}
      >
        <div className={`w-[50%] ${mdScreen && 'w-full'}`}>
          <Tabs
            onValueChange={(weekday) => handleChangeWeekday(weekday as WeekdaysUppercase)}
            defaultValue={format(new Date(), 'EEEE').toUpperCase()}
            value={selectedWeekday}
          >
            <div className="inline-flex w-full flex-col items-center justify-start gap-2 rounded-lg bg-gray-50 py-2">
              <Form {...form}>
                <form className="w-full">
                  <TabsList className="w-full">
                    {weekdays.map((weekday, index) => (
                      <TabsTrigger className="flex-1" key={weekday} value={weekday.toUpperCase()}>
                        {width
                          ? width < 1440
                            ? width < 768
                              ? weekdaysLetter[index]
                              : weekdaysShort[index]
                            : weekday
                          : weekday}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <MemberSelect onChange={handleChangeMember} />

                  <div className="mt-2 flex flex-col gap-2 sm:flex-row mt-4">
                    <DialogNewAssignment />
                    {assignments.current.length > 0 && (
                      <Button
                        type="button"
                        className="w-full"
                        variant="secondary"
                        onClick={() => setOpenTransferDialog(true)}
                      >
                        Transfer Route
                      </Button>
                    )}
                    <DialogTransferCompleteRoute
                      open={openTransferDialog}
                      setOpen={setOpenTransferDialog}
                      isEntireRoute={true}
                    />
                  </div>

                  {/* {assignmentToId !== user?.id && (
                    <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-600">
                      Note: Only the assigned technician can reorganize their routes when logged into their account.
                    </div>
                  )} */}

                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    {assignments.current.length > 0 && (
                      <Button
                        type="button"
                        className="mt-2 w-full bg-blue-500 hover:bg-blue-700"
                        onClick={() => setIsOptimizeModalOpen(true)}
                      >
                        Optimize Route
                      </Button>
                    )}
                    {getDifference(assignments.initial, assignments.current) && (
                      <Button
                        type="button"
                        onClick={() =>
                          updateAssignments(
                            assignments.current.map((assignment) => {
                              return {
                                assignmentId: assignment.id,
                                ...assignment
                              };
                            })
                          )
                        }
                        className="mt-2 w-full bg-green-500 hover:bg-green-700"
                        disabled={assignmentToId !== user?.id}
                      >
                        {assignmentToId !== user?.id ?  'Save (only your technicians)' : 'Save'}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>

              <TabsContent value={selectedWeekday} className="w-full">
                <AssignmentsList handleDragEnd={handleDragEnd} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className={`h-fit w-[50%] ${mdScreen && 'w-full'}`}>
          <Map
            assignments={assignments.current}
            directions={directions}
            distance={distance}
            duration={duration}
            isLoaded={isLoaded}
            loadError={loadError}
          />
        </div>
      </div>
      {assignments.current.length > 0 && (
        <OptimizeRouteModal
          open={isOptimizeModalOpen}
          onOpenChange={setIsOptimizeModalOpen}
          onOptimize={handleOptimize}
          assignments={assignments.current}
          userAddress={user.address}
        />
      )}
    </FormProvider>
  );
}

export type FormSchema = z.infer<typeof newAssignmentSchema>;

const weekdays: Weekdays[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekdaysLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
