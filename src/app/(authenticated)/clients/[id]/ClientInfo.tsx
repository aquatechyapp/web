import InputField from '@/app/_components/InputField';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import StateAndCitySelect from '@/app/_components/StateAndCitySelect';
import { Button } from '@/app/_components/ui/button';
import { Form } from '@/app/_components/ui/form';
import { useUpdateClient } from '@/hooks/react-query/clients/updateClient';
import { clientSchema } from '@/schemas/client';
import { poolSchema } from '@/schemas/pool';
import { filterChangedFormFields } from '@/utils/getDirtyFields';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const additionalSchemas = z.object({
  weekday: z.enum(
    [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ],
    {
      required_error: 'Weekday is required.',
      invalid_type_error: 'Weekday is required.'
    }
  ),
  frequency: z.string(z.enum(['MONTHLY', 'TRIWEEKLY', 'BIWEEKLY', 'WEEKLY'])),
  sameBillingAddress: z.boolean(),
  startOn: z.coerce.date(),
  endAfter: z.coerce.date(),
  assignmentToId: z.string()
});

const poolAndClientSchema = clientSchema.and(poolSchema).and(additionalSchemas);

export default function ClientInfo({ client }) {
  const { mutate, isPending } = useUpdateClient();

  // const form = useForm<z.infer<typeof poolAndClientSchema>>({
  const form = useForm({
    // resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      city: client.city || '',
      state: client.state || '',
      zip: client.zip || '',
      email1: client.email1 || '',
      phone1: client.phone1 || '',
      notes: client.notes || undefined,
      address: client.address || ''
    }
  });

  if (isPending) return <LoadingSpinner />;

  const handleSubmit = async (data) => {
    let dirtyFields = filterChangedFormFields(
      form.getValues(),
      form.formState.dirtyFields
    );
    if (form.watch('phone1') !== client.phone1) {
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
        className="flex flex-col items-start justify-start gap-2 self-stretch bg-white p-6"
      >
        <div className="BasicInformation font-['Public Sans'] h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Basic information
        </div>
        <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
          <InputField
            form={form}
            name="address"
            placeholder="Billing address"
          />
          <StateAndCitySelect form={form} cityName="city" stateName="state" />
          <InputField
            form={form}
            name="zip"
            placeholder="Zip code"
            type="zip"
          />
        </div>
        <div className="mt-4 h-5 text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Contact information
        </div>
        <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
          <InputField
            type="phone"
            form={form}
            name="phone1"
            placeholder="Mobile phone"
          />
          {/* <InputField
            name="phone2"
            type="phone"
            form={form}
            placeholder="Mobile phone 2"
          /> */}
          <InputField form={form} name="email1" placeholder="E-mail" />

          {/* <InputField form={form} name="email2" placeholder="Invoice e-mail" /> */}
        </div>
        <InputField
          form={form}
          placeholder="Type client notes here..."
          name="clientNotes"
          type="textArea"
        />
        {/* <div className="NotesAboutClientCustomerWonTSeeThat font-['Public Sans'] h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
          Notes about client (customer won't see that)
        </div>
        <Textarea
          className="h-[100%]"
          placeholder="Type client notes here..."
        /> */}
        {form.formState.isDirty && (
          <Button type="submit" className="w-full">
            Save
          </Button>
        )}
      </form>
    </Form>
  );
}
