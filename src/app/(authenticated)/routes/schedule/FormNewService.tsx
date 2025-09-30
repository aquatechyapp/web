import { format, getDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import SelectField from '@/components/SelectField';
import { Form } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/LoadingSpinner';

import { Frequencies } from '@/constants';

import useGetClients from '@/hooks/react-query/clients/getClients';

import { Client } from '@/ts/interfaces/Client';

import { buildSelectOptions } from '@/utils/formUtils';
import { FormSchema } from './page';
import { Weekdays } from '@/ts/interfaces/Weekday';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { useGetServiceTypes } from '@/hooks/react-query/service-types/useGetServiceTypes';
import { useUserStore } from '@/store/user';

export const FormNewService = () => {
  const form = useFormContext<FormSchema>();
  const { user } = useUserStore();

  const [next10Days, setNext10Days] = useState<
    {
      name: string;
      key: string;
      value: string;
    }[]
  >([]);

  // const disabledWeekdays = useDisabledWeekdays();
  const { data: clients = [], isLoading } = useGetAllClients();
  const clientId = form.watch('clientId');
  const selectedClient = clients.find((c: Client) => c.id === clientId);
  const { data: serviceTypesData, isLoading: isServiceTypesLoading } = useGetServiceTypes(selectedClient?.companyOwnerId || '');

  useEffect(() => {
    getNext10Dates();
  }, []);

  if (isLoading || isServiceTypesLoading) return <LoadingSpinner />;

  const serviceTypes = serviceTypesData?.serviceTypes || [];

  const hasClients = clients.length > 0;
  const hasServiceTypes = serviceTypes.length > 0;

  function getNext10Dates() {
    const startDate = new Date();

    const dates: { name: string; key: string; value: string }[] = [];

    for (let i = 1; i <= 10; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + i); // Add weeks to match the same weekday

      const formattedDate = format(nextDate, 'EEEE, MMMM d, yyyy');
      const weekdayName = format(nextDate, 'yyyy-MM-dd');

      // create a key with date ex: 2022-12-31

      const isoDate = String(nextDate); // Get the ISO string for the date

      dates.push({
        name: formattedDate,
        key: weekdayName,
        value: isoDate
      });
    }

    setNext10Days(dates);
  }

  return isLoading ? (
    <LoadingSpinner />
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
                  // Procura a piscina somente quando seleciona o cliente
                  clients.find((c: Client) => c.id === clientId)?.pools?.filter(pool => pool.isActive),
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
  );
};
