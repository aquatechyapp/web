'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import InputField from '@/app/_components/InputField';
import StateAndCitySelect from '../../../../_components/StateAndCitySelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema } from '@/schemas/client';
import { poolSchema } from '@/schemas/pool';
import { CreateFormData } from '@/utils';
import SelectField from '@/app/_components/SelectField';
import { Frequencies, PoolTypes, Weekdays } from '@/constants';
import { DropFileZone } from '@/app/_components/DropFileZone';
import DatePickerField from '@/app/_components/DatePickerField';
import { clientAxios } from '@/services/clientAxios';
import { useRouter } from 'next/navigation';

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

export function FormClientAndPool() {
  const { push } = useRouter();
  const form = useForm<z.infer<typeof poolAndClientSchema>>({
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      assignmentToId: '65bb1e9ba689059879dc46c8',
      animalDanger: false,
      phone1: '',
      lockerCode: '',
      montlyPayment: null,
      poolNotes: '',
      poolAddress: 'Address',
      poolCity: 'City',
      enterSide: '',
      email1: '',
      clientName: '',
      clientAddress: '',
      clientNotes: '',
      clientZip: '',
      poolState: 'ST',
      poolZip: '12345-11',
      sameBillingAddress: false
    }
  });
  const handleSubmit = async (data) => {
    await clientAxios
      .post('/client-pool', CreateFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        push('/clients');
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
          <div className="font-['Public Sans'] h-5 text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Basic information
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <InputField form={form} name="clientName" placeholder="Full name" />
            <InputField form={form} name="company" placeholder="Company" />
            <InputField
              form={form}
              name="lockerCode"
              placeholder="Customer code"
            />
          </div>
          <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
            <InputField
              form={form}
              name="clientAddress"
              placeholder="Billing address"
            />
            <StateAndCitySelect form={form} />
            <InputField form={form} name="clientZip" placeholder="Zip code" />
          </div>
          <div className="ContactInformation font-['Public Sans'] h-5 text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Contact information
          </div>
          <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
            <InputField
              type="phone"
              form={form}
              name="phone1"
              placeholder="Mobile phone"
            />
            <InputField form={form} name="email1" placeholder="E-mail" />
            <InputField
              form={form}
              name="invoiceEmail"
              placeholder="Invoice e-mail"
            />
          </div>
          <div className="h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Notes about client (customer won’t see that)
          </div>

          <InputField
            name="clientNotes"
            form={form}
            placeholder="Type clients notes here..."
            type="textArea"
          />
          <div className="self-stretch  text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Service information
          </div>
          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <InputField
              form={form}
              name="sameBillingAddress"
              type="sameBillingAddress"
            />
          </div>

          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <Checkbox id="animals-danger" />
            <label
              htmlFor="animals-danger"
              className="text-sm font-medium font-semibold leading-none text-gray-400"
            >
              It must take care with animals?
            </label>
          </div>

          <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
            <Input placeholder="Monthly payment by client" />
            <InputField form={form} name="lockerCode" placeholder="Gate code" />
            <InputField form={form} name="enterSide" placeholder="Enter side" />
            <SelectField
              name="poolType"
              placeholder="Chemical type"
              form={form}
              data={PoolTypes}
            />
          </div>
          <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
            <div className="WithLabelTextArea inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
              <InputField
                className="h-44"
                name="poolNotes"
                form={form}
                placeholder="Location notes..."
                type="textArea"
              />
            </div>
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
              <DropFileZone form={form} />
            </div>
          </div>
          <div className="h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Assignment information
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <Input placeholder="Technician" />
            <SelectField
              name="weekday"
              placeholder="Weekdays"
              form={form}
              data={Weekdays}
            />
            <SelectField
              name="frequency"
              placeholder="Frequency"
              form={form}
              data={Frequencies}
            />
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
          <Button type="submit" className="w-full">
            Add client
          </Button>
        </div>
      </form>
    </Form>
  );
}
