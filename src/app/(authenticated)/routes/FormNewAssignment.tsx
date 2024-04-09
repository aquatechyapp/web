import SelectField from '@/app/_components/SelectField';
import { Form } from '@/app/_components/ui/form';
import { useQuery } from '@tanstack/react-query';
import { buildSelectOptions } from '@/utils';
import { Frequencies } from '@/constants';
import { clientAxios } from '@/services/clientAxios';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import InputField from '@/app/_components/InputField';
import CalendarField from '@/app/_components/CalendarField';
import { Separator } from '@/app/_components/ui/separator';

export const FormNewAssignment = ({ form }) => {
  const { data, isLoading, isError } = useQuery({
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
      <form className="w-[90%] flex flex-col">
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4 ">
            <SelectField
              data={buildSelectOptions(
                data.filter((client) => client.pools.length > 0),
                {
                  id: 'id',
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
                  data?.find((c) => c.id === clientId)?.pools,
                  {
                    id: 'id',
                    name: 'name',
                    value: 'id'
                  }
                )}
                placeholder="Location"
                form={form}
                name="poolId"
              />
            )}
          </div>
          <div className="flex gap-4">
            <SelectField
              name="frequency"
              placeholder="Frequency"
              form={form}
              data={Frequencies}
            />
            <InputField
              name="paidByService"
              form={form}
              placeholder="0.00$"
              label="Paid by Service"
              type="currencyValue"
            />
          </div>

          <div className="flex gap-8 mt-4">
            <CalendarField form={form} name="startOn" placeholder="Start on" />
            <Separator orientation="vertical" className="h-72" />
            <CalendarField
              form={form}
              name="endAfter"
              placeholder="End after"
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
