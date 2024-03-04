'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import InputField from '@/app/_components/InputField';
import StateAndCitySelect from '../../../_components/StateAndCitySelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema } from '@/schemas/client';
import { poolSchema } from '@/schemas/pool';
import { createFormData } from '@/utils';
import SelectField from '@/app/_components/SelectField';
import { Frequencies, PoolTypes, Weekdays } from '@/constants';
import DatePickerField from '@/app/_components/DatePickerField';
import { clientAxios } from '@/services/clientAxios';
import { useRouter } from 'next/navigation';
import { InputFile } from '@/app/_components/InputFile';
import { isBefore } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/user';
import { useEffect } from 'react';
import { dateSchema } from '@/schemas/date';

export default function Page() {
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (data) =>
      await clientAxios.post('/client-pool', createFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      push('/clients');
      toast({
        variant: 'destructive',
        title: 'Client added successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error adding client',
        className: 'bg-red-500 text-white'
      });
    }
  });
  const { push } = useRouter();

  const subContractors =
    user?.subcontractors?.length > 0
      ? user.subcontractors
          .filter((sub) => sub.status === 'Accepted')
          .map((sub) => ({
            key: sub.id,
            name: sub.subcontractor.name,
            value: sub.id
          }))
      : [];

  const form = useForm<z.infer<typeof poolAndClientSchema>>({
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      assignmentToId: '',
      animalDanger: false,
      phone1: '',
      lockerCode: '',
      montlyPayment: null,
      poolNotes: '',
      poolAddress: '',
      poolCity: '',
      enterSide: '',
      email1: '',
      clientName: '',
      clientAddress: '',
      clientNotes: '',
      clientZip: '',
      poolState: '',
      poolZip: '',
      sameBillingAddress: false,
      clientCity: '',
      clientState: ''
    }
  });

  function handleSameBillingAddress() {
    if (form.watch('sameBillingAddress')) {
      form.setValue('poolAddress', form.getValues('clientAddress'));
      form.setValue('poolCity', form.getValues('clientCity'));
      form.setValue('poolState', form.getValues('clientState'));
      form.setValue('poolZip', form.getValues('clientZip'));
    }
  }

  useEffect(() => {
    handleSameBillingAddress();
  }, [
    form.watch('sameBillingAddress'),
    form.watch('clientAddress'),
    form.watch('clientCity'),
    form.watch('clientState'),
    form.watch('clientZip')
  ]);

  function handleImagesChange(images: never[]) {
    form.setValue('photo', images);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
          <div className="h-5 text-sm font-medium leading-tight tracking-tight text-zinc-500">
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
            Notes about client (customer won't see that)
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
              type="checkbox"
              placeholder="Billing address is the same than service address"
              // onChange={handleSameBillingAddress}
            />
          </div>

          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <InputField
              form={form}
              name="animalDanger"
              type="checkbox"
              placeholder="It must take care with animals?"
            />
          </div>
          {!form.watch('sameBillingAddress') && (
            <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
              <InputField
                form={form}
                name="poolAddress"
                placeholder="Billing address"
              />
              <StateAndCitySelect
                form={form}
                stateName="poolState"
                cityName="poolCity"
              />
              <InputField form={form} name="poolZip" placeholder="Zip code" />
            </div>
          )}

          <div className="Form inline-flex items-start justify-start gap-4 self-stretch">
            <InputField
              form={form}
              name="montlyPayment"
              placeholder="Monthly payment by client"
            />
            <InputField form={form} name="lockerCode" placeholder="Gate code" />
            <InputField form={form} name="enterSide" placeholder="Enter side" />
            <SelectField
              name="poolType"
              placeholder="Chemical type"
              form={form}
              data={PoolTypes}
            />
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
              <InputField
                className="h-44"
                name="poolNotes"
                form={form}
                placeholder="Location notes..."
                type="textArea"
              />
            </div>
            <div className="h-44 w-full inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
              <InputFile handleChange={handleImagesChange} />
            </div>
          </div>
          <div className="h-5 self-stretch text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Assignment information
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <SelectField
              disabled={subContractors.length === 0}
              name="assignmentToId"
              placeholder="Technician"
              form={form}
              data={subContractors?.length > 0 ? subContractors : []}
            />
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
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              />
            ) : (
              'Add client'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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
  assignmentToId: z.string().min(1),
  photo: z.array(z.any())
});

const poolAndClientSchema = clientSchema
  .and(poolSchema)
  .and(additionalSchemas)
  .and(dateSchema);

const defaultValue2 = {
  assignmentToId: '65d3bf1b79b4b4244e9ecc06',
  animalDanger: false,
  phone1: '+1 (231) 231-2312',
  lockerCode: null,
  montlyPayment: null,
  poolNotes: 'a',
  poolAddress: 'asdasdasd',
  poolCity: 'Washington, D.C.',
  enterSide: '123',
  email1: 'mauricio@mauricio.com',
  clientName: 'cliente com foto real',
  clientAddress: 'asdasdasd',
  clientNotes: 'a',
  clientZip: '123123',
  poolState: 'DC',
  poolZip: '123123',
  sameBillingAddress: true,
  clientCity: 'Washington, D.C.',
  clientState: 'DC',
  poolType: 'Salt',
  weekday: 'FRIDAY',
  frequency: 'BIWEEKLY',
  startOn: '2024-02-22T03:00:00.000Z',
  endAfter: '2024-02-29T03:00:00.000Z'
};
