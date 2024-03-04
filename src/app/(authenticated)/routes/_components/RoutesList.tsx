'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import TechnicianSelect from './TechnicianSelect';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '../../loading';
import { Button } from '@/components/ui/button';
import { ModalNewAssignment } from './ModalNewAssignment';
import { clientAxios } from '@/services/clientAxios';
import { useUserContext } from '@/context/user';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { dateSchema } from '@/schemas/date';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { AssignmentsList } from './AssignmentsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Map from './Map';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { FormNewAssignment } from './FormNewAssignment';

export type Weekdays =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

const isEmpty = (val) => val == null || !(Object.keys(val) || val).length;

export function RoutesList({ assignments: assignmentsList }) {
  const [assignments, setAssignments] = useState(assignmentsList);

  useEffect(() => {
    setAssignments(assignmentsList);
  }, [assignmentsList]);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUserContext();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await clientAxios.post('/assignments', data),

    onError: () => {
      toast({
        title: 'Error creating assignment',
        className: 'bg-red-500 text-white'
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Assignment created successfully',
        className: 'bg-green-500 text-white'
      });
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   form.reset(undefined, { keepValues: true });
  // }, [isModalOpen]);

  const form = useForm<z.infer<typeof newAssignmentSchema>>({
    resolver: zodResolver(newAssignmentSchema),
    defaultValues: {
      assignmentToId: user.id,
      poolId: '',
      weekday: format(new Date(), 'EEEE').toUpperCase(),
      frequency: '',
      startOn: undefined,
      endAfter: undefined
    }
  });

  async function createNewAssignment(data) {
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

  if (isPending) return <Loading />;
  console.log(form.getValues());

  return (
    <>
      <div className="w-[50%]">
        <Tabs
          onValueChange={(weekday) => form.setValue('weekday', weekday)}
          defaultValue={format(new Date(), 'EEEE').toUpperCase()}
        >
          <div className="inline-flex w-full flex-col items-center justify-start gap-3.5 rounded-lg border border-zinc-200 bg-white px-6 py-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(createNewAssignment)}>
                <TabsList>
                  {weekdays.map((weekday) => (
                    <TabsTrigger key={weekday} value={weekday.toUpperCase()}>
                      {weekday}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TechnicianSelect
                  // por padrão, o User logado é o tecnico selecionado
                  defaultValue={user.id}
                  technicians={[
                    {
                      subcontractor: {
                        id: user.id,
                        name: user.name
                      }
                    },
                    ...user.subcontractors.filter(
                      (sub) => sub.status === 'Accepted'
                    )
                  ]}
                  onChange={(technicianId) =>
                    form.setValue('assignmentToId', technicianId)
                  }
                />
              </form>
            </Form>
            <Button onClick={() => setIsModalOpen(true)} className="w-full ">
              New assignment
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              {form.watch('assignmentToId') && (
                <>
                  <DialogContent>
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
            <TabsContent value={form.watch('weekday')} className="w-full">
              {/* O filtro dos assignments precisa ser feito dentro de AssignmentsList, por causa
                do componente TabsContent. Esse componente de Tabs se baseia no value para exibir 
                seus childrens (AssignmentsList). Como na aba tabs o value se baseia somente no weekday,
                quando eu altero o Technician, ele só vai atualizar o render quando mudar de Weekday
                A solução foi enviar todos os assignments e fazer o .filter lá dentro */}
              <AssignmentsList
                setAssignments={setAssignments}
                assignments={assignments}
                assignmentToId={form.watch('assignmentToId')}
                weekday={form.watch('weekday')}
                userId={user.id}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="w-[50%]">
        <Map
          // verificar pra passar o assignments ordenado e filtrado ja
          assignments={assignments.filter(
            (a) =>
              a.assignmentToId === form.watch('assignmentToId') &&
              a.weekday === form.watch('weekday')
          )}
        />
      </div>
    </>
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
