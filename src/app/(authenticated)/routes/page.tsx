'use client';
import { format } from 'date-fns';
import { useState } from 'react';
import TechnicianSelect from './TechnicianSelect';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/app/_components/ui/button';
import { clientAxios } from '@/services/clientAxios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { dateSchema } from '@/schemas/date';
import { Form } from '@/app/_components/ui/form';
import { useToast } from '@/app/_components/ui/use-toast';
import { AssignmentsList } from './AssignmentsList';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/_components/ui/tabs';
import Map from './Map';
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@/app/_components/ui/dialog';
import { FormNewAssignment } from './FormNewAssignment';
import { arrayMove } from '@dnd-kit/sortable';
import { useTechniciansContext } from '@/context/technicians';
import { useAssignmentsContext } from '@/context/assignments';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import { isEmpty } from '@/utils';
import { useUpdateAssignments } from '@/hooks/react-query/assignments/updateAssignments';
import { Assignment, CreateAssignment } from '@/interfaces/Assignments';
import { useWeekdayContext } from '@/context/weekday';

export type Weekdays =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export default function Page() {
  const { technicians, assignmentToId, setAssignmentToId } =
    useTechniciansContext();
  const { assignments, setAssignments } = useAssignmentsContext();
  const { selectedWeekday, setSelectedWeekday } = useWeekdayContext();
  const { mutate: updateAssignments, isPending: isUpdateAssignmentsPending } =
    useUpdateAssignments();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateAssignment) =>
      await clientAxios.post('/assignments', data),

    onError: () => {
      toast({
        title: 'Error creating assignment',
        className: 'bg-red-500 text-white'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Assignment created successfully',
        className: 'bg-green-500 text-white'
      });
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof newAssignmentSchema>>({
    resolver: zodResolver(newAssignmentSchema),
    defaultValues: {
      assignmentToId: assignmentToId,
      poolId: '',
      weekday: format(new Date(), 'EEEE').toUpperCase(),
      frequency: '',
      startOn: undefined,
      endAfter: undefined
    }
  });

  async function createNewAssignment() {
    const isValid = await validateForm();
    if (isValid) {
      setIsModalOpen(false);
      mutate({
        assignmentToId: form.watch('assignmentToId'),
        poolId: form.watch('poolId'),
        weekday: form.watch('weekday'),
        frequency: form.watch('frequency'),
        startOn: form.watch('startOn'),
        endAfter: form.watch('endAfter')
      });
      form.reset();
      return;
    }

    setIsModalOpen(true);
  }

  function getDifference(array1: Assignment[], array2: Assignment[]): boolean {
    return JSON.stringify(array1) !== JSON.stringify(array2);
  }

  // função para resolver bug onde isValid na function createNewAssignment não estava com o valor correto
  const validateForm = async (): Promise<boolean> => {
    const _ = form.formState.errors; // also works if you read form.formState.isValid
    await form.trigger();
    if (form.formState.isValid) {
      return true;
    }
    if (isEmpty(form.formState.errors)) {
      console.error('Error in the form');
    } else {
      console.error(form.formState.errors);
    }
    return false;
  };

  if (isPending) return <LoadingSpinner />;

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
    form.setValue('assignmentToId', technicianId);
    setAssignmentToId(technicianId);
  }

  if (isUpdateAssignmentsPending) return <LoadingSpinner />;

  return (
    <div className="inline-flex h-[100%] w-full items-start justify-start gap-3 bg-white p-2.5 shadow-inner">
      <div className="w-[50%]">
        <Tabs
          onValueChange={(weekday) => handleChangeWeekday(weekday)}
          defaultValue={format(new Date(), 'EEEE').toUpperCase()}
          value={selectedWeekday}
        >
          <div className="inline-flex w-full flex-col items-center justify-start gap-3.5 rounded-lg border border-zinc-200 bg-white py-2">
            <Form {...form}>
              <form
                className="w-full px-2"
                onSubmit={form.handleSubmit(createNewAssignment)}
              >
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
                <TechnicianSelect
                  // por padrão, o User logado é o tecnico selecionado
                  defaultValue={assignmentToId}
                  technicians={technicians}
                  onChange={(technicianId: string) =>
                    handleChangeTechnician(technicianId)
                  }
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mt-2"
                  >
                    New assignment
                  </Button>

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
                </div>
              </form>
            </Form>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              {form.watch('assignmentToId') && (
                <>
                  <DialogContent className="max-w-fit">
                    <DialogTitle>Create Assignment</DialogTitle>
                    <FormNewAssignment form={form} />
                    <div className="flex justify-around">
                      <Button
                        onClick={createNewAssignment}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        Accept
                      </Button>

                      <Button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </>
              )}
            </Dialog>
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
  );
}

const newAssignmentSchema = z
  .object({
    assignmentToId: z.string().min(1),
    poolId: z.string(),
    client: z.string(),
    frequency: z.string(z.enum(['MONTHLY', 'TRIWEEKLY', 'BIWEEKLY', 'WEEKLY'])),
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
