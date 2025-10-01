import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useCreateService } from '@/hooks/react-query/services/createService';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { useGetServiceTypes } from '@/hooks/react-query/service-types/useGetServiceTypes';
import { isEmpty } from '@/utils';
import { buildSelectOptions } from '@/utils/formUtils';

import { Client } from '@/ts/interfaces/Client';
import { useUserStore } from '@/store/user';

import { FormSchema } from './page';

export function DialogNewService() {
  const form = useFormContext<FormSchema>();
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [next10Days, setNext10Days] = useState<
    {
      name: string;
      key: string;
      value: string;
    }[]
  >([]);

  const { data: clients = [], isLoading } = useGetAllClients();
  const clientId = form.watch('clientId');
  const selectedClient = clients.find((c: Client) => c.id === clientId);
  const { data: serviceTypesData, isLoading: isServiceTypesLoading } = useGetServiceTypes(
    selectedClient?.companyOwnerId || ''
  );

  const { mutate, isPending } = useCreateService();

  useEffect(() => {
    getNext10Dates();
  }, []);

  const serviceTypes = serviceTypesData?.serviceTypes || [];
  const hasClients = clients.length > 0;
  const hasServiceTypes = serviceTypes.length > 0;

  function getNext10Dates() {
    const startDate = new Date();
    const dates: { name: string; key: string; value: string }[] = [];

    for (let i = 0; i < 10; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + i);

      const formattedDate = format(nextDate, 'EEEE, MMMM d, yyyy');
      const weekdayName = format(nextDate, 'yyyy-MM-dd');
      const isoDate = String(nextDate);

      dates.push({
        name: i === 0 ? `Today, ${formattedDate}` : formattedDate,
        key: weekdayName,
        value: isoDate
      });
    }

    setNext10Days(dates);
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

  async function createNewService() {
    form.setValue('assignedToId', form.getValues('assignedToId'));

    const isValid = await validateForm();

    if (isValid) {
      const assignedToId = form.watch('assignedToId');

      mutate(
        {
          poolId: form.watch('poolId'),
          assignedToId,
          scheduledTo: form.watch('scheduledTo'),
          serviceTypeId: form.watch('serviceTypeId')
        },
        {
          onSuccess: () => {
            // preciso guardar o assignmentToId selecionado antes de dar reset, se não vai bugar ao criar 2 assignments seguidos
            // em um technician que não é o user logado
            form.reset();
            form.setValue('assignedToId', assignedToId);
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
      <DialogTrigger asChild className="mt-2 w-full">
        <Button className="w-full" type="button">
          New service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen w-96 rounded-md md:w-[680px]">
        <DialogTitle className="mb-4">Create service</DialogTitle>
        {isPending ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-sm text-gray-600">Creating service...</p>
          </div>
        ) : isLoading || isServiceTypesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <Form {...form}>
            <form className="flex flex-col">
              <div className="flex flex-col gap-2">
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
                    name="clientId"
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

                <div className="mt-2 flex gap-4">
                  <SelectField
                    label="Schedule to"
                    name="scheduledTo"
                    placeholder="Schedule on"
                    options={next10Days.map((date) => ({
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
            <Button className="w-full" onClick={createNewService}>
              Create
            </Button>

            <Button variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
