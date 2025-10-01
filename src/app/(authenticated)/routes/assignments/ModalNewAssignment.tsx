import { format, getDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useCreateAssignment } from '@/hooks/react-query/assignments/createAssignment';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { useGetServiceTypes } from '@/hooks/react-query/service-types/useGetServiceTypes';
import { isEmpty } from '@/utils';
import { buildSelectOptions } from '@/utils/formUtils';

import { Frequencies } from '@/constants';
import { Client } from '@/ts/interfaces/Client';
import { useUserStore } from '@/store/user';

import { FormSchema } from './page';

export function DialogNewAssignment() {
  const form = useFormContext<FormSchema>();
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startOn, weekday] = form.watch(['startOn', 'weekday']);
  const [next10WeekdaysStartOn, setNext10WeekdaysStartOn] = useState<
    {
      name: string;
      key: string;
      value: string;
    }[]
  >([]);
  const [next10WeekdaysEndAfter, setNext10WeekdaysEndAfter] = useState<
    {
      name: string;
      key: string;
      value: string;
    }[]
  >([]);

  const { data: clients = [], isLoading } = useGetAllClients();
  const clientId = form.watch('client');
  const selectedClient = clients.find((c: Client) => c.id === clientId);
  const { data: serviceTypesData, isLoading: isServiceTypesLoading } = useGetServiceTypes(
    selectedClient?.companyOwnerId || ''
  );

  const { mutate, isPending } = useCreateAssignment();

  useEffect(() => {
    if (weekday) {
      form.resetField('startOn');
      form.resetField('endAfter');
      getNext10DatesForEndAfterBasedOnWeekday(startOn);
      getNext10DatesForStartOnBasedOnWeekday(weekday);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekday]);

  useEffect(() => {
    if (startOn) {
      getNext10DatesForEndAfterBasedOnWeekday(startOn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOn]);

  const serviceTypes = serviceTypesData?.serviceTypes || [];
  const hasClients = clients.length > 0;
  const hasServiceTypes = serviceTypes.length > 0;

  function getNext10DatesForStartOnBasedOnWeekday(weekday: string) {
    if (!weekday) return;
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetWeekday = weekdays.indexOf(weekday.toLowerCase());

    if (targetWeekday === -1) {
      throw new Error('Invalid weekday. Please use a valid weekday name.');
    }

    const today = new Date();
    const todayWeekday = getDay(today);
    let daysToNext = (targetWeekday - todayWeekday + 7) % 7;

    if (daysToNext === 0) {
      daysToNext = 0;
    } else {
      daysToNext = daysToNext || 7;
    }
    const dates: { name: string; key: string; value: string }[] = [];

    for (let i = 0; i < 10; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysToNext + i * 7);

      const formattedDate = format(nextDate, 'EEEE, MMMM d, yyyy');
      const weekdayName = format(nextDate, 'yyyy-MM-dd');
      const isoDate = String(nextDate);

      dates.push({
        name: formattedDate,
        key: weekdayName,
        value: isoDate
      });
    }

    setNext10WeekdaysStartOn(dates);
  }

  function getNext10DatesForEndAfterBasedOnWeekday(startOn: Date) {
    if (!startOn) return;

    const startDate = new Date(startOn);
    const dates: { name: string; key: string; value: string }[] = [];

    dates.push({
      name: 'No end',
      key: 'No end',
      value: 'No end'
    });

    for (let i = 1; i <= 10; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + i * 7);

      const formattedDate = format(nextDate, 'EEEE, MMMM d, yyyy');
      const weekdayName = format(nextDate, 'yyyy-MM-dd');
      const isoDate = String(nextDate);

      dates.push({
        name: formattedDate,
        key: weekdayName,
        value: isoDate
      });
    }

    setNext10WeekdaysEndAfter(dates);
  }

  const validateForm = async (): Promise<boolean> => {
    const isValid = await form.trigger();

    if (isValid) {
      return true;
    }
    if (isEmpty(form.formState.errors)) {
      console.error('Error in the form');
    } else {
      console.error(form.formState.errors);
    }
    return false;
  };

  async function createNewAssignment() {
    form.setValue('assignmentToId', form.getValues('assignmentToId'));
    form.setValue('weekday', form.getValues('weekday'));

    const isValid = await validateForm();

    if (isValid) {
      const weekday = form.watch('weekday');
      const assignmentToId = form.watch('assignmentToId');

      mutate(
        {
          assignmentToId,
          poolId: form.watch('poolId'),
          serviceTypeId: form.watch('serviceTypeId'),
          weekday: form.watch('weekday'),
          frequency: form.watch('frequency'),
          startOn: form.watch('startOn'),
          endAfter: form.watch('endAfter')
        },
        {
          onSuccess: () => {
            // preciso guardar o assignmentToId selecionado antes de dar reset, se não vai bugar ao criar 2 assignments seguidos
            // em um technician que não é o user logado
            form.reset();
            form.setValue('assignmentToId', assignmentToId);
            form.setValue('weekday', weekday);
            setIsModalOpen(false);
          }
        }
      );
      return;
    }

    setIsModalOpen(true);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={isPending ? undefined : setIsModalOpen}>
      <DialogTrigger asChild className="w-full">
        <Button className="w-full" type="button">
          New Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen w-96 rounded-md md:w-[680px]">
        <DialogTitle>Create Assignment</DialogTitle>
        {isPending ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-sm text-gray-600">Creating assignment...</p>
          </div>
        ) : isLoading || isServiceTypesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <Form {...form}>
            <form className="flex flex-col">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <SelectField
                    options={clients
                      .filter((c: Client) => c.isActive && c.pools.length > 0)
                      .map((c: Client) => ({
                        key: c.id,
                        name: `${c.firstName} ${c.lastName}`,
                        value: c.id
                      }))}
                    label="Clients"
                    placeholder={hasClients ? 'Client' : 'No clients available'}
                    name="client"
                  />
                  {clientId && (
                    <SelectField
                      options={buildSelectOptions(
                        clients.find((c: Client) => c.id === clientId)?.pools?.filter((pool) => pool.isActive),
                        {
                          key: 'id',
                          name: 'name',
                          value: 'id'
                        }
                      )}
                      label="Location"
                      placeholder="Location"
                      name="poolId"
                    />
                  )}
                  {clientId && (
                    <SelectField
                      options={serviceTypes
                        .filter((serviceType) => serviceType.isActive)
                        .map((serviceType) => ({
                          key: serviceType.id,
                          name: serviceType.name,
                          value: serviceType.id
                        }))}
                      label="Service Type"
                      placeholder={hasServiceTypes ? 'Select service type' : 'No service types available'}
                      name="serviceTypeId"
                    />
                  )}
                </div>
                <div className="flex gap-4">
                  <SelectField name="frequency" placeholder="Frequency" label="Frequency" options={Frequencies} />
                </div>

                <div className="mt-4 flex gap-4">
                  <SelectField
                    label="Start on"
                    name="startOn"
                    placeholder="Start on"
                    options={next10WeekdaysStartOn.map((date) => ({
                      key: date.key,
                      name: date.name,
                      value: date.value
                    }))}
                  />
                  <SelectField
                    label="End after"
                    name="endAfter"
                    placeholder="End after"
                    options={next10WeekdaysEndAfter.map((date) => ({
                      key: date.key,
                      name: date.name,
                      value: date.value
                    }))}
                  />
                </div>
              </div>
            </form>
          </Form>
        )}
        {!isPending && !isLoading && !isServiceTypesLoading && (
          <div className="flex justify-around gap-4 pt-4">
            <Button className='w-full' onClick={createNewAssignment}>Create</Button>

            <Button variant="outline" className='w-full' onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
