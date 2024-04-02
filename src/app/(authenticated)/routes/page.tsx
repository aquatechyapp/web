'use client';
import { format } from 'date-fns';
import TechnicianSelect from './TechnicianSelect';
import { Button } from '@/app/_components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { dateSchema } from '@/schemas/date';
import { Form } from '@/app/_components/ui/form';
import { AssignmentsList } from './AssignmentsList';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/_components/ui/tabs';
import Map from './Map';

import { arrayMove } from '@dnd-kit/sortable';
import { useTechniciansContext } from '@/context/technicians';
import {
  AssignmentsProvider,
  useAssignmentsContext
} from '@/context/assignments';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import { useUpdateAssignments } from '@/hooks/react-query/assignments/updateAssignments';
import { Assignment } from '@/interfaces/Assignments';
import { useWeekdayContext } from '@/context/weekday';
import { DialogNewAssignment } from './dialog-new-assignment';
import { DialogTransferRoute } from './dialog-transfer-route';
import { useState } from 'react';

export type Weekdays =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export default function Page() {
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const { assignmentToId, setAssignmentToId } = useTechniciansContext();
  const { assignments, setAssignments } = useAssignmentsContext();
  const { selectedWeekday, setSelectedWeekday } = useWeekdayContext();
  const { mutate: updateAssignments, isPending: isUpdateAssignmentsPending } =
    useUpdateAssignments();

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

  function handleDragEnd(event, setActive) {
    const { active, over } = event;
    setActive(null);
    if (!active || !over) return;
    if (active.id !== over.id) {
      const oldIndex = assignments.current.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = assignments.current.findIndex(
        (item) => item.id === over.id
      );

      const changedOrderProperty = arrayMove(
        assignments.current,
        oldIndex,
        newIndex
      ).map((assignment, index) => {
        return { ...assignment, order: index + 1 };
      });

      setAssignments({
        ...assignments,
        current: changedOrderProperty
      });
    }
  }

  function handleChangeWeekday(weekday: string) {
    form.setValue('weekday', weekday);
    setSelectedWeekday(weekday);
  }

  function handleChangeTechnician(technicianId: string) {
    setAssignmentToId(technicianId);
    form.setValue('assignmentToId', technicianId);
  }

  if (isUpdateAssignmentsPending) return <LoadingSpinner />;

  return (
    <AssignmentsProvider>
      <div className="inline-flex h-[100%] w-full items-start justify-start gap-3 bg-white p-2.5 shadow-inner">
        <div className="w-[50%]">
          <Tabs
            onValueChange={(weekday) => handleChangeWeekday(weekday)}
            defaultValue={format(new Date(), 'EEEE').toUpperCase()}
            value={selectedWeekday}
          >
            <div className="inline-flex w-full flex-col items-center justify-start gap-3.5 rounded-lg border border-zinc-200 bg-white py-2">
              <Form {...form}>
                <form className="w-full px-2">
                  <TabsList className="w-full">
                    {weekdays.map((weekday) => (
                      <TabsTrigger
                        className="flex-1"
                        key={weekday}
                        value={weekday.toUpperCase()}
                      >
                        {weekday}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TechnicianSelect onChange={handleChangeTechnician} />
                  <div className="flex gap-2 mt-2">
                    <DialogNewAssignment form={form} />
                    <Button
                      type="button"
                      className="w-full"
                      variant={'secondary'}
                      onClick={() => setOpenTransferDialog(true)}
                    >
                      Transfer Route
                    </Button>
                    <DialogTransferRoute
                      open={openTransferDialog}
                      setOpen={setOpenTransferDialog}
                      form={form}
                      assignments={assignments.current}
                      assignmentToId={assignmentToId}
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
                      className="w-full mt-2 bg-green-500 hover:bg-green-700"
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
        <div className="w-[50%]">
          <Map
            assignments={assignments.current}
            selectedWeekday={selectedWeekday}
          />
        </div>
      </div>
    </AssignmentsProvider>
  );
}

const newAssignmentSchema = z
  .object({
    assignmentToId: z.string().min(1),
    poolId: z.string(),
    client: z.string(),
    frequency: z.string(z.enum(['MONTHLY', 'TRIWEEKLY', 'BIWEEKLY', 'WEEKLY'])),
    // paidByService must be a number, here we are checking if has value in input,
    //  but in dialog-new-assignment we are transforming it to a Number
    paidByService: z.string(),
    weekday: z.string(
      z.enum([
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY'
      ])
    )
  })
  .and(dateSchema);

const weekdays: Weekdays[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
