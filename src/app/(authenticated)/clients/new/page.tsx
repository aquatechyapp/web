'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import DatePickerField from '@/components/DatePickerField';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Frequencies, PoolTypes, Weekdays } from '@/constants';
import { useDisabledWeekdays } from '@/hooks/useDisabledWeekdays';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { clientAxios } from '@/lib/clientAxios';
import { paidByServiceSchema } from '@/schemas/assignments';
import { clientSchema } from '@/schemas/client';
import { dateSchema } from '@/schemas/date';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { poolSchema } from '@/schemas/pool';
import { useUserStore } from '@/store/user';
import { FieldType, IanaTimeZones } from '@/ts/enums/enums';
import { createFormData } from '@/utils/formUtils';

type PoolAndClientSchema = z.infer<typeof poolAndClientSchema>;

export default function Page() {
  const { user, shouldDisableNewPools } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      shouldDisableNewPools: state.shouldDisableNewPools
    }))
  );

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { width } = useWindowDimensions();
  const isMobile = width ? width < 640 : false;
  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (data: PoolAndClientSchema) =>
      await clientAxios.post('/client-pool-assignment', createFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      push('/clients');
      toast({
        duration: 2000,
        title: 'Client added successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error adding client',
        className: 'bg-red-500 text-white'
      });
    }
  });

  const { push } = useRouter();

  useEffect(() => {
    if (shouldDisableNewPools) {
      push('/clients');
      toast({
        title: 'You have reached the pool limit',
        description: 'Upgrade to a paid plan to add more pools',
        className: 'bg-red-500 text-white'
      });
    }
  }, []);

  const subContractors = useMemo(() => {
    if (!user) return [];
    const userAsSubcontractor = {
      key: user.id,
      name: user.firstName + ' ' + user.lastName,
      value: user.id
    };
    return user.workRelationsAsAEmployer
      .filter((sub) => sub.status === 'Active')
      .map((sub) => ({
        key: sub.subcontractorId,
        name: sub.subcontractor.firstName + ' ' + sub.subcontractor.lastName,
        value: sub.subcontractorId
      }))
      .concat(userAsSubcontractor);
  }, [user]);

  const form = useForm<PoolAndClientSchema>({
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      assignmentToId: '',
      animalDanger: false,
      phone: '',
      lockerCode: '',
      monthlyPayment: undefined,
      poolNotes: '',
      poolAddress: '',
      poolCity: '',
      enterSide: '',
      email: '',
      firstName: '',
      lastName: '',
      clientAddress: '',
      clientNotes: '',
      clientZip: '',
      poolState: '',
      poolZip: '',
      sameBillingAddress: false,
      clientCity: '',
      clientState: '',
      customerCode: '',
      paidByService: undefined,
      clientCompany: '',
      clientType: 'Residential',
      timezone: IanaTimeZones.NY
    }
  });

  const disabledWeekdays = useDisabledWeekdays(form.watch('weekday'));

  function handleSameBillingAddress() {
    if (form.watch('sameBillingAddress')) {
      form.setValue('poolAddress', form.getValues('clientAddress'));
      form.setValue('poolCity', form.getValues('clientCity'));
      form.setValue('poolState', form.getValues('clientState'));
      form.setValue('poolZip', form.getValues('clientZip'));
    }
  }

  const [sameBillingAddress, clientAddress, clientCity, clientState, clientZip] = form.watch([
    'sameBillingAddress',
    'clientAddress',
    'clientCity',
    'clientState',
    'clientZip'
  ]);

  const handleCheckboxSameBillingAddress = useMemo(() => {
    return {
      sameBillingAddress,
      clientAddress,
      clientCity,
      clientState,
      clientZip
    };
  }, [sameBillingAddress, clientAddress, clientCity, clientState, clientZip]);

  useEffect(() => {
    handleSameBillingAddress();
  }, [handleCheckboxSameBillingAddress]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
          <div className="h-5 text-sm font-medium text-gray-500">Basic information</div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <InputField name="firstName" placeholder="First name" label="First name" />
            <InputField name="lastName" placeholder="Last name" label="Last name" />
            <InputField name="clientCompany" placeholder="Company" label="Company" />
            <InputField name="customerCode" placeholder="Customer code" label="Customer code" />
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <InputField name="clientAddress" placeholder="Billing address" label="Billing address" />
            <StateAndCitySelect />
            <InputField name="clientZip" label="Zip code" placeholder="Zip code" type={FieldType.Zip} />
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row md:w-[50%]">
            <SelectField
              defaultValue="Residential"
              placeholder="Client Type"
              name="type"
              label="Client Type"
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
          <div className="mt-4 flex w-full items-center whitespace-nowrap text-sm font-medium text-gray-500">
            <span className="mr-2">Contact information</span>
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <InputField type={FieldType.Phone} name="phone" placeholder="Mobile phone" label="Mobile phone" />
            <InputField name="email" placeholder="E-mail" label="E-mail" />
            <InputField name="invoiceEmail" placeholder="Invoice e-mail" label="Invoice e-mail" />
          </div>
          <div className="flex w-full items-center gap-4">
            <div className="w-[50%]">
              <InputField
                label={isMobile ? 'Notes about client' : "Notes about client (customer won't see that)"}
                name="clientNotes"
                placeholder="Type clients notes here..."
                type={FieldType.TextArea}
              />
            </div>
          </div>

          <div className="mt-2 flex w-full items-center whitespace-nowrap text-sm font-medium text-gray-500">
            <span className="mr-2">Service information</span>
          </div>
          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <InputField
              name="sameBillingAddress"
              type={FieldType.Checkbox}
              placeholder="Billing address is the same than service address"
            />
          </div>
          <div className="inline-flex items-start justify-start gap-2 self-stretch">
            <InputField name="animalDanger" type={FieldType.Checkbox} placeholder="It must take care with animals?" />
          </div>
          {!form.watch('sameBillingAddress') && (
            <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
              <InputField name="poolAddress" placeholder="Billing address" label="Billing address" />
              <StateAndCitySelect stateName="poolState" cityName="poolCity" />
              <InputField
                className="min-w-fit"
                name="poolZip"
                label="Zip code"
                placeholder="Zip code"
                type={FieldType.Zip}
              />
            </div>
          )}
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <InputField
              name="monthlyPayment"
              placeholder="Monthly payment by client"
              type={FieldType.CurrencyValue}
              label="Monthly payment by client"
            />
            <InputField name="lockerCode" placeholder="Gate code" label="Gate code" />
            <InputField name="enterSide" placeholder="Enter side" label="Enter side" />
            <SelectField name="poolType" label="Chemical type" placeholder="Chemical type" options={PoolTypes} />
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
              <InputField
                className="h-44"
                name="poolNotes"
                placeholder="Location notes..."
                label={isMobile ? 'Notes about location' : "Notes about location (customer won't see that)"}
                type={FieldType.TextArea}
              />
            </div>
          </div>
          <div className="mt-4 flex w-full items-center whitespace-nowrap text-sm font-medium text-gray-500">
            <span className="mr-2">Assignment information</span>
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <SelectField
              disabled={subContractors.length === 0}
              name="assignmentToId"
              placeholder="Technician"
              label="Technician"
              options={subContractors?.length > 0 ? subContractors : []}
            />
            <InputField
              name="paidByService"
              placeholder="0.00$"
              label="Paid by Service"
              type={FieldType.CurrencyValue}
            />
            <SelectField label="Weekday" name="weekday" placeholder="Weekday" options={Weekdays} />
            <SelectField label="Frequency" name="frequency" placeholder="Frequency" options={Frequencies} />
          </div>
          <div className="inline-flex w-full items-start justify-start gap-4">
            <DatePickerField
              disabled={[{ dayOfWeek: disabledWeekdays }]}
              name="startOn"
              label="Start on"
              placeholder="Start on"
            />
            <DatePickerField
              disabled={[{ dayOfWeek: disabledWeekdays }]}
              name="endAfter"
              label="End after"
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
  weekday: defaultSchemas.weekday,
  frequency: z.string(z.enum(['MONTHLY', 'TRIWEEKLY', 'BIWEEKLY', 'WEEKLY'])),
  sameBillingAddress: z.boolean(),
  assignmentToId: z.string().min(1),
  customerCode: z.string().nullable(),
  monthlyPayment: defaultSchemas.monthlyPayment,
  clientCompany: z.string().nullable(),
  clientType: z.enum(['Commercial', 'Residential']),
  timezone: defaultSchemas.timezone
});

const poolAndClientSchema = clientSchema
  .and(poolSchema)
  .and(additionalSchemas)
  .and(dateSchema)
  .and(paidByServiceSchema);
