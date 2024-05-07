'use client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssignmentsContext } from '@/context/assignments';
import { useTechniciansContext } from '@/context/technicians';
import { useWeekdayContext } from '@/context/weekday';
import { useUpdateAssignments } from '@/hooks/react-query/assignments/updateAssignments';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Assignment } from '@/interfaces/Assignments';
import { Weekdays, WeekdaysUppercase } from '@/interfaces/Weekday';
import { paidByServiceSchema } from '@/schemas/assignments';
import { dateSchema } from '@/schemas/date';

import { AssignmentsList } from './AssignmentsList';
import { DialogNewAssignment } from './dialog-new-assignment';
import { DialogTransferRoute } from './dialog-transfer-route';
import Map from './Map';
import TechnicianSelect from './TechnicianSelect';

export default function Page() {
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const { assignmentToId, setAssignmentToId } = useTechniciansContext();
  const { assignments, setAssignments } = useAssignmentsContext();
  const { selectedWeekday, setSelectedWeekday } = useWeekdayContext();
  const { width } = useWindowDimensions();
  const { mutate: updateAssignments, isPending: isUpdateAssignmentsPending } = useUpdateAssignments();

  const form = useForm<z.infer<typeof newAssignmentSchema>>({
    resolver: zodResolver(newAssignmentSchema),
    defaultValues: {
      assignmentToId: assignmentToId,
      poolId: '',
      weekday: format(new Date(), 'EEEE').toUpperCase(),
      frequency: '',
      paidByService: undefined,
      startOn: undefined,
      endAfter: undefined
    }
  });

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
    }
  }

  function handleChangeWeekday(weekday: WeekdaysUppercase) {
    form.setValue('weekday', weekday);
    setSelectedWeekday(weekday);
  }

  function handleChangeTechnician(technicianId: string) {
    setAssignmentToId(technicianId);
    form.setValue('assignmentToId', technicianId);
  }

  if (isUpdateAssignmentsPending) return <LoadingSpinner />;

  return (
    <div>
      <div className="inline-flex h-[100%] w-full items-start justify-start gap-3 bg-gray-50 p-2.5 shadow-inner">
        <div className="w-[50%]">
          <Tabs
            onValueChange={(weekday) => handleChangeWeekday(weekday as WeekdaysUppercase)}
            defaultValue={format(new Date(), 'EEEE').toUpperCase()}
            value={selectedWeekday}
          >
            <div className="inline-flex w-full flex-col items-center justify-start gap-3.5 rounded-lg border border-gray-200 bg-gray-50 py-2">
              <Form {...form}>
                <form className="w-full px-2">
                  <TabsList className="w-full">
                    {weekdays.map((weekday, index) => (
                      <TabsTrigger className="flex-1" key={weekday} value={weekday.toUpperCase()}>
                        {width ? (width < 1440 ? weekdaysShort[index] : weekday) : weekday}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TechnicianSelect onChange={handleChangeTechnician} />
                  <div className="mt-2 flex gap-2">
                    <DialogNewAssignment form={form} />
                    {assignments.current.length > 0 && (
                      <Button
                        type="button"
                        className="w-full"
                        variant={'secondary'}
                        onClick={() => setOpenTransferDialog(true)}
                      >
                        Transfer Route
                      </Button>
                    )}
                    <DialogTransferRoute
                      open={openTransferDialog}
                      setOpen={setOpenTransferDialog}
                      assignmentToId={assignmentToId}
                      isEntireRoute={true}
                    />
                  </div>
                  {getDifference(assignments.initial, assignments.current) && (
                    <Button
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
        <div className="h-fit w-[50%]">
          <Map assignments={assignments.current} />
        </div>
      </div>
    </div>
  );
}

const newAssignmentSchema = z
  .object({
    assignmentToId: z.string().min(1),
    poolId: z.string(),
    client: z.string(),
    frequency: z.string(z.enum(['MONTHLY', 'TRIWEEKLY', 'BIWEEKLY', 'WEEKLY'])),
    weekday: z.string(z.enum(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']))
  })
  .and(dateSchema)
  .and(paidByServiceSchema);

const weekdays: Weekdays[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
