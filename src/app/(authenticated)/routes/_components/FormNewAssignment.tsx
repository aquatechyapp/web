import DatePickerField from '@/app/_components/DatePickerField';
import SelectField from '@/app/_components/SelectField';
import { Form } from '@/components/ui/form';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../loading';
import { buildSelectOptions } from '@/utils';
import { Frequencies } from '@/constants';
import { clientAxios } from '@/services/clientAxios';

export const FormNewAssignment = ({ form }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientAxios('/clients');
      return response.data;
    },
    staleTime: Infinity
  });

  if (isLoading) return <Loading />;

  const clientId = form.watch('client');

  return (
    <Form {...form}>
      <form className="w-[90%]">
        <div className="flex flex-col gap-4">
          <SelectField
            data={buildSelectOptions(
              data.filter((client) => client.pools.length > 0),
              {
                id: 'id',
                name: 'name',
                value: 'id'
              }
            )}
            placeholder="Client"
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
          <SelectField
            name="frequency"
            placeholder="Frequency"
            form={form}
            data={Frequencies}
          />
          <div className="flex gap-4">
            <DatePickerField
              form={form}
              name="startOn"
              placeholder="Start on"
            />
            <DatePickerField
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
