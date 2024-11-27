'use client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { addWeeks, format, nextDay, startOfDay, subWeeks } from 'date-fns';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssignmentsContext } from '@/context/assignments';
import { useUpdateAssignments } from '@/hooks/react-query/assignments/updateAssignments';
import { useMapUtils } from '@/hooks/useMapUtils';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { paidByServiceSchema } from '@/schemas/assignments';
import { dateSchema } from '@/schemas/date';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useTechniciansStore } from '@/store/technicians';
import { useUserStore } from '@/store/user';
import { useWeekdayStore } from '@/store/weekday';
import { WeekdaysUppercase as WeekdaysUppercaseEnum } from '@/ts/enums/enums';
import { Assignment } from '@/ts/interfaces/Assignments';
import { Weekdays, WeekdaysUppercase } from '@/ts/interfaces/Weekday';

import { AssignmentsList } from './AssignmentsList';
import Map from './Map';
import { DialogNewAssignment } from './ModalNewAssignment';
import { DialogTransferRoute } from './ModalTransferRoute';
import TechnicianSelect from './TechnicianSelect';

export default function Page() {
  const { directions, distance, duration, isLoaded, loadError, getDirectionsFromGoogleMaps } = useMapUtils();
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const { assignments, setAssignments } = useAssignmentsContext();
  const { selectedWeekday, setSelectedWeekday, setSelectedDay, selectedDay } = useWeekdayStore((state) => state);
  const { width = 0 } = useWindowDimensions();
  const { mutate: updateAssignments, isPending: isUpdateAssignmentsPending } = useUpdateAssignments();

  const nextSixWeeks = useMemo(() => {
    const today = startOfDay(new Date());
    const weekdayIndex = Object.keys(WeekdaysUppercaseEnum).indexOf(selectedWeekday);
    const selectedDay =
      weekdayIndex === today.getDay() ? today : nextDay(today, weekdayIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6);

    return [
      subWeeks(selectedDay, 2),
      subWeeks(selectedDay, 1),
      selectedDay,
      ...Array.from({ length: 4 }, (_, i) => addWeeks(selectedDay, i + 1))
    ];
  }, [selectedWeekday]);

  const { user, isFreePlan } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      isFreePlan: state.isFreePlan
    }))
  );
  const { assignmentToId, setAssignmentToId } = useTechniciansStore(
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
      weekday: format(new Date(), 'EEEE').toUpperCase() as WeekdaysUppercase,
      frequency: '',
      paidByService: undefined,
      startOn: undefined,
      endAfter: undefined
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
      getDirectionsFromGoogleMaps();
    }
  }

  function handleChangeWeekday(weekday: WeekdaysUppercase) {
    form.setValue('weekday', weekday);
    setSelectedWeekday(weekday);
    const weekdayIndex = Object.keys(WeekdaysUppercaseEnum).indexOf(weekday);
    const today = startOfDay(new Date());

    const selectedDay =
      weekdayIndex === today.getDay() ? today : nextDay(today, weekdayIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6);

    setSelectedDay(selectedDay.toISOString());
  }

  function handleChangeDay(dateString: string) {
    setSelectedDay(dateString);
  }

  function handleChangeTechnician(technicianId: string) {
    setAssignmentToId(technicianId);
    form.setValue('assignmentToId', technicianId);
  }

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
                  <Tabs
                    onValueChange={(day) => handleChangeDay(day)}
                    defaultValue={format(new Date(), 'EEEE').toUpperCase()}
                    value={selectedDay}
                  >
                    <TabsList className="mt-2 w-full">
                      {nextSixWeeks.map((date, index) => (
                        <TabsTrigger className="flex-1" key={date.toISOString()} value={date.toISOString()}>
                          {index === 2 ? format(date, 'dd/MM') : format(date, 'dd/MM')}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  <TechnicianSelect onChange={handleChangeTechnician} />
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
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
                    <DialogTransferRoute
                      open={openTransferDialog}
                      setOpen={setOpenTransferDialog}
                      isEntireRoute={true}
                    />
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    {assignments.current.length > 0 && assignmentToId === user?.id && (
                      <HoverCard>
                        <HoverCardTrigger className="w-full">
                          <Button
                            disabled={isFreePlan}
                            type="button"
                            className="mt-2 w-full bg-blue-500 hover:bg-blue-700"
                            onClick={() => getDirectionsFromGoogleMaps(true)}
                          >
                            Optimize Route
                          </Button>
                        </HoverCardTrigger>
                        {isFreePlan && (
                          <HoverCardContent side="bottom" className="w-full">
                            This feature is not available in Free Plan.
                          </HoverCardContent>
                        )}
                      </HoverCard>
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
                      >
                        Save
                      </Button>
                    )}
                  </div>
                </form>
              </Form>

              <TabsContent value={selectedWeekday} className="w-full">
                {/* O filtro dos assignments precisa ser feito dentro de AssignmentsList, por causa
                do componente TabsContent. Esse componente de Tabs se baseia no value para exibir
                seus childrens (AssignmentsList). Como na aba tabs o value se baseia somente no weekday,
                quando eu altero o Technician, ele só vai atualizar o render quando mudar de Weekday
                A solução foi enviar todos os assignments e fazer o .filter lá dentro */}
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
    </FormProvider>
  );
}

export type FormSchema = z.infer<typeof newAssignmentSchema>;

const newAssignmentSchema = z
  .object({
    assignmentToId: z.string().min(1),
    poolId: z.string(),
    client: z.string(),
    frequency: defaultSchemas.frequency,
    weekday: defaultSchemas.weekday
  })
  .and(dateSchema)
  .and(paidByServiceSchema);

const weekdays: Weekdays[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// const days = ['09', '16', '23', '30', '07', '10', '17'];

const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekdaysLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
