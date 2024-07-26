import { useQuery } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';

import CalendarField from '@/components/CalendarField';
import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Frequencies } from '@/constants';
import { FieldType } from '@/constants/enums';
import { useDisabledWeekdays } from '@/hooks/useDisabledWeekdays';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Client } from '@/interfaces/Client';
import { clientAxios } from '@/lib/clientAxios';
import { buildSelectOptions } from '@/utils/formUtils';

import { FormSchema } from './page';

type Props = {
  form: UseFormReturn<FormSchema>;
};

export const FormNewAssignment = ({ form }: Props) => {
  const { width = 0 } = useWindowDimensions();
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
  const hasClients = data.length > 0;

  return (
    <Form {...form}>
      <form className="flex w-[90%] flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <SelectField
              data={buildSelectOptions(
                data.filter((client: Client) => client.pools.length > 0),
                {
                  key: 'id',
                  name: 'name',
                  value: 'id'
                }
              )}
              label="Clients"
              placeholder={hasClients ? 'Client' : 'No clients available'}
              form={form}
              name="client"
            />
            {clientId && (
              <SelectField
                data={buildSelectOptions(
                  // Procura a piscina somente quando seleciona o cliente
                  data?.find((c: Client) => c.id === clientId)?.pools,
                  {
                    key: 'id',
                    name: 'name',
                    value: 'id'
                  }
                )}
                label="Location"
                placeholder="Location"
                form={form}
                name="poolId"
              />
            )}
          </div>
          <div className="flex gap-4">
            <SelectField name="frequency" placeholder="Frequency" label="Frequency" form={form} data={Frequencies} />
            <InputField
              name="paidByService"
              form={form}
              placeholder="0.00$"
              label="Paid by Service"
              type={FieldType.CurrencyValue}
            />
          </div>

          <div className="mt-4 flex flex-col gap-8 md:flex-row">
            <CalendarField disabledWeekdays={disabledWeekdays} form={form} name="startOn" placeholder="Start on" />
            {width > 768 && <Separator orientation="vertical" className="h-72" />}
            <CalendarField disabledWeekdays={disabledWeekdays} form={form} name="endAfter" placeholder="End after" />
          </div>
        </div>
      </form>
    </Form>
  );
};
