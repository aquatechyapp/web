import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FieldType } from '@/constants/enums';
import { useUpdateClient } from '@/hooks/react-query/clients/updateClient';
import { Client } from '@/interfaces/Client';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { getDirtyValues } from '@/utils/formUtils';

const formSchema = z.object({
  address: defaultSchemas.address,
  city: defaultSchemas.city,
  state: defaultSchemas.state,
  zip: defaultSchemas.zip,
  email1: defaultSchemas.email,
  phone1: defaultSchemas.phone,
  notes: defaultSchemas.notes,
  company: defaultSchemas.name,
  type: defaultSchemas.clientType
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
      email1: client.email1 || '',
      phone1: client.phone1 || '',
      notes: client.notes || undefined,
      address: client.address || '',
      company: client.company || '',
      type: client.type || 'Residential'
    }
  });

  const phoneChanged = form.watch('phone1') !== client.phone1;

  if (isPending) return <LoadingSpinner />;

  const handleSubmit = async () => {
    let dirtyFields = getDirtyValues(form.getValues(), form.formState.dirtyFields) as FormData;
    if (phoneChanged) {
      dirtyFields = {
        ...dirtyFields,
        phone1: form.watch('phone1')
      };
    }
    mutate(dirtyFields);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-start justify-start gap-2 self-stretch bg-gray-50 p-6"
      >
        <div className="h-5 w-[213.40px] text-sm font-medium text-gray-500">Basic information</div>
        <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField form={form} name="address" placeholder="Billing address" />
          <StateAndCitySelect form={form} cityName="city" stateName="state" />
        </div>
        <div className="flex flex-wrap gap-4 md:flex-nowrap">
          <InputField form={form} name="zip" placeholder="Zip code" type={FieldType.Zip} />
          <InputField form={form} name="company" placeholder="Company" />
          <SelectField
            placeholder="Client Type"
            form={form}
            name="type"
            label="Type"
            data={[
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
        </div>
        <div className="mt-4 h-5 text-sm font-medium text-gray-500">Contact information</div>
        <div className="Form inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
          <InputField type={FieldType.Phone} form={form} name="phone1" placeholder="Mobile phone" />
          <InputField form={form} name="email1" placeholder="E-mail" />
        </div>
        <div className="w-full">
          <InputField
            form={form}
            placeholder="Type client notes here..."
            name="clientNotes"
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
        {(form.formState.isDirty || phoneChanged) && (
          <Button type="submit" className="w-full">
            Save
          </Button>
        )}
      </form>
    </Form>
  );
}
