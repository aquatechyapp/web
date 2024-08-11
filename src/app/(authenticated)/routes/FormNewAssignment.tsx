import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';

import DatePickerField from '@/components/DatePickerField';
import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Form } from '@/components/ui/form';
import { Frequencies } from '@/constants';
import { FieldType } from '@/constants/enums';
import { useDisabledWeekdays } from '@/hooks/useDisabledWeekdays';
import { Client } from '@/interfaces/Client';
import { clientAxios } from '@/lib/clientAxios';
import { buildSelectOptions } from '@/utils/formUtils';

import { FormSchema } from './page';

export const FormNewAssignment = () => {
  const form = useFormContext<FormSchema>();

  const disabledWeekdays = useDisabledWeekdays();
  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientAxios('/clients');
      return response.data;
    },
    staleTime: Infinity
  });

  if (isLoading) return <LoadingSpinner />;

  const clientId = form.watch('client');
  const hasClients = data.clients.length > 0;

  return (
    <Form {...form}>
      <form className="flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <SelectField
              options={data.clients
                .filter((c: Client) => c.pools.length > 0)
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
                  // Procura a piscina somente quando seleciona o cliente
                  data?.clients.find((c: Client) => c.id === clientId)?.pools,
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
          </div>
          <div className="flex gap-4">
            <SelectField name="frequency" placeholder="Frequency" label="Frequency" options={Frequencies} />
            <InputField
              name="paidByService"
              placeholder="0.00$"
              label="Paid by Service"
              type={FieldType.CurrencyValue}
            />
          </div>

          {/* <div className="mt-4 flex flex-col gap-8 md:flex-row"> */}
          <DatePickerField disabledWeekdays={disabledWeekdays} name="startOn" placeholder="Start on" />

          <DatePickerField disabledWeekdays={disabledWeekdays} name="endAfter" placeholder="End after" />
          {/* </div> */}
        </div>
      </form>
    </Form>
  );
};
