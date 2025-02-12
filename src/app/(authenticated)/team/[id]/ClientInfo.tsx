import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUpdateClient } from '@/hooks/react-query/clients/updateClient';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { FieldType, IanaTimeZones } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';

const formSchema = z.object({
  address: defaultSchemas.address,
  city: defaultSchemas.city,
  state: defaultSchemas.state,
  zip: defaultSchemas.zipCode,
  email: defaultSchemas.email,
  phone: defaultSchemas.phone,
  notes: defaultSchemas.stringOptional,
  clientCompany: defaultSchemas.stringOptional,
  type: defaultSchemas.clientType,
  timezone: defaultSchemas.timezone
});

type FormData = z.infer<typeof formSchema>;

export default function ClientInfo({ client }: { client: Client }) {
  const { mutate, isPending } = useUpdateClient<FormData>();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: client.city || '',
      state: client.state || '',
      zip: client.zip || '',
      email: client.email || '',
      phone: client.phone || '',
      notes: client.notes || undefined,
      address: client.address || '',
      clientCompany: client.company || '',
      type: client.type || 'Residential',
      timezone: client.timezone
    }
  });

  if (isPending) return <LoadingSpinner />;

  const handleSubmit = async () => {
    mutate(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-start justify-start gap-2 self-stretch bg-gray-50"
      >
        <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField name="address" placeholder="Billing address" label="Billing address" />
          <StateAndCitySelect cityName="city" stateName="state" />
        </div>
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap [&>*]:flex-1">
          <InputField name="zip" label="Zip code" placeholder="Zip code" type={FieldType.Zip} />
          <InputField name="clientCompany" label="Company" placeholder="Company" />
          <SelectField
            placeholder="Client Type"
            name="type"
            label="Type"
            options={[
              {
                key: 'Residential',
                name: 'Residential',
                value: 'Residential'
              },
              {
                key: 'Commercial',
                name: 'Commercial',
                value: 'Commercial'
              }
            ]}
          />
          <SelectField
            defaultValue="Residential"
            placeholder="Select Time Zone"
            name="timezone"
            label="Client Time zone"
            options={Object.values(IanaTimeZones).map((tz) => ({
              key: tz,
              name: tz,
              value: tz
            }))}
          />
        </div>
        <Typography element="h4" className="mt-2">
          Contact information
        </Typography>
        <div className="Form inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField type={FieldType.Phone} name="phone" placeholder="Phone" label="Phone" />
          <InputField name="email" placeholder="E-mail" label="E-mail" />
        </div>
        <div className="mt-2 w-full">
          <InputField
            placeholder="Type client notes here..."
            label="Client Notes"
            name="notes"
            type={FieldType.TextArea}
          />
        </div>
        {/* <div className="NotesAboutClientCustomerWonTSeeThat font-['Public Sans'] h-5 self-stretch text-sm font-medium   text-gray-500">
          Notes about client (customer won't see that)
        </div>
        <Textarea
          className="h-[100%]"
          placeholder="Type client notes here..."
        /> */}
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
