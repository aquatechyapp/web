'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format, getDay } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Frequencies, PoolTypes, Weekdays } from '@/constants';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { clientAxios } from '@/lib/clientAxios';
import { clientSchema } from '@/schemas/client';
import { dateSchema } from '@/schemas/date';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { poolSchema } from '@/schemas/pool';
import { useUserStore } from '@/store/user';
import { FieldType, IanaTimeZones } from '@/ts/enums/enums';
import { createFormData } from '@/utils/formUtils';
import { isEmpty } from '@/utils';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';

type PoolAndClientSchema = z.infer<typeof poolAndClientSchema>;

export default function Page() {
  const { user, shouldDisableNewPools } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      shouldDisableNewPools: state.shouldDisableNewPools
    }))
  );

  const { data: members, isLoading } = useGetMembersOfAllCompaniesByUserId(user.id);
  const { data: companies } = useGetCompanies();

  const [next10WeekdaysStartOn, setNext10WeekdaysStartOn] = useState<
    {
      name: string;
      key: string;
      value: string;
    }[]
  >([]);

  const [next10WeekdaysEndAfter, setNext10WeekdaysEndAfter] = useState<
    {
      name: string;
      key: string;
      value: string;
    }[]
  >([]);

  const validateForm = async (): Promise<boolean> => {
    const isValid = await form.trigger();

    if (isValid) {
      return true;
    }
    if (isEmpty(form.formState.errors)) {
      console.error('Error in the form');
    } else {
      console.error(form.formState.errors);
    }
    return false;
  };

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { width } = useWindowDimensions();
  const isMobile = width ? width < 640 : false;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PoolAndClientSchema) =>
      await clientAxios.post('/client-pool-assignment', createFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      push('/clients');
      toast({
        duration: 5000,
        title: 'Client added successfully',
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 5000,
        title: 'Error adding client',
        variant: 'error',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });

  const { push } = useRouter();

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  useEffect(() => {
    if (shouldDisableNewPools) {
      push('/clients');
      toast({
        title: 'You have reached the pool limit',
        description: 'Upgrade to a paid plan to add more pools',
        variant: 'error'
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
    // return user.workRelationsAsAEmployer
    //   .filter((sub) => sub.status === 'Active')
    //   .map((sub) => ({
    //     key: sub.subcontractorId,
    //     name: sub.subcontractor.firstName + ' ' + sub.subcontractor.lastName,
    //     value: sub.subcontractorId
    //   }))
    //   .concat(userAsSubcontractor);

    return userAsSubcontractor;
  }, [user]);

  const form = useForm<PoolAndClientSchema>({
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      assignmentToId: '',
      animalDanger: false,
      phone: '+19542970632',
      lockerCode: '123',
      monthlyPayment: 10000,
      poolNotes: '',
      poolAddress: '4375 SW 10TH PL 205',
      poolCity: 'Deerfield Beach',
      enterSide: 'Right',
      email: 'kawanstrelow@gmail.com',
      firstName: 'Kawan',
      lastName: 'Strelow',
      clientAddress: '4375 SW 10TH PL 205',
      clientNotes: '',
      clientZip: '33442',
      poolState: 'FL',
      poolZip: '33442',
      sameBillingAddress: false,
      clientCity: 'Deerfield Beach',
      clientState: 'FL',
      customerCode: '',
      clientCompany: '',
      clientType: 'Residential',
      timezone: IanaTimeZones.NY
      // assignmentToId: '',
      // animalDanger: false,
      // phone: '',
      // lockerCode: '',
      // monthlyPayment: undefined,
      // poolNotes: '',
      // poolAddress: '',
      // poolCity: '',
      // enterSide: '',
      // email: '',
      // firstName: '',
      // lastName: '',
      // clientAddress: '',
      // clientNotes: '',
      // clientZip: '',
      // poolState: '',
      // poolZip: '',
      // sameBillingAddress: false,
      // clientCity: '',
      // clientState: '',
      // customerCode: '',
      // clientCompany: '',
      // clientType: 'Residential',
      // timezone: IanaTimeZones.NY
    }
  });

  // const disabledWeekdays = useDisabledWeekdays(form.watch('weekday'));

  function handleSameBillingAddress() {
    if (form.watch('sameBillingAddress')) {
      form.setValue('poolAddress', form.getValues('clientAddress'));
      form.setValue('poolCity', form.getValues('clientCity'));
      form.setValue('poolState', form.getValues('clientState'));
      form.setValue('poolZip', form.getValues('clientZip'));
    }
  }

  function getNext10DatesForStartOnBasedOnWeekday(weekday: string) {
    // Convert weekday string to a number (0=Sunday, 1=Monday, ..., 6=Saturday)

    if (!weekday) return;
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetWeekday = weekdays.indexOf(weekday.toLowerCase());

    if (targetWeekday === -1) {
      throw new Error('Invalid weekday. Please use a valid weekday name.');
    }

    const today = new Date();
    const todayWeekday = getDay(today); // Get current weekday
    let daysToNext = (targetWeekday - todayWeekday + 7) % 7; // Calculate days to the next occurrence

    // If today is the target weekday, include today
    if (daysToNext === 0) {
      daysToNext = 0; // Set to 0 to include today
    } else {
      daysToNext = daysToNext || 7; // Otherwise, find the next week's same weekday
    }
    const dates: { name: string; key: string; value: string }[] = [];

    for (let i = 0; i < 10; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysToNext + i * 7); // Add weeks

      const formattedDate = format(nextDate, 'EEEE, MMMM d, yyyy');
      const weekdayName = format(nextDate, 'yyyy-MM-dd');
      const isoDate = String(nextDate); // Get the ISO string for the date

      dates.push({
        name: formattedDate,
        key: weekdayName,
        value: isoDate
      });
    }

    setNext10WeekdaysStartOn(dates);
  }

  function getNext10DatesForEndAfterBasedOnWeekday(startOn: Date) {
    // Convert weekday string to a number (0=Sunday, 1=Monday, ..., 6=Saturday)

    if (!startOn) return;

    const startDate = new Date(startOn); // UTC time

    const dates: { name: string; key: string; value: string }[] = [];

    dates.push({
      name: 'No end',
      key: 'No end',
      value: 'No end'
    });

    for (let i = 1; i <= 10; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + i * 7); // Add weeks to match the same weekday

      const formattedDate = format(nextDate, 'EEEE, MMMM d, yyyy');
      const weekdayName = format(nextDate, 'yyyy-MM-dd');
      // create a key with date ex: 2022-12-31

      const isoDate = String(nextDate); // Get the ISO string for the date

      dates.push({
        name: formattedDate,
        key: weekdayName,
        value: isoDate
      });
    }

    setNext10WeekdaysEndAfter(dates);
  }

  async function handleCreateClientPoolAndAssignment(data: PoolAndClientSchema) {
    const isValid = await validateForm();

    if (isValid) {
      mutate(data);
      form.reset();
      return;
    }
  }

  const [sameBillingAddress, clientAddress, clientCity, clientState, clientZip, startOn, weekday] = form.watch([
    'sameBillingAddress',
    'clientAddress',
    'clientCity',
    'clientState',
    'clientZip',
    'startOn',
    'weekday'
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

  useEffect(() => {
    form.resetField('startOn');
    form.resetField('endAfter');
    getNext10DatesForEndAfterBasedOnWeekday(startOn);
    getNext10DatesForStartOnBasedOnWeekday(weekday);
  }, [form.watch('weekday')]);

  useEffect(() => {
    getNext10DatesForEndAfterBasedOnWeekday(form.watch('startOn'));
  }, [form.watch('startOn')]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleCreateClientPoolAndAssignment(data))}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 p-2">
          <Typography element="h2" className="pb-0 text-base">
            Basic information
          </Typography>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <SelectField
              placeholder="Company owner"
              name="companyOwnerId"
              label="Company owner"
              options={
                companies?.map((c) => ({
                  key: c.id,
                  name: c.name,
                  value: c.id
                })) || []
              }
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <InputField name="firstName" placeholder="First name" label="First name" />
            <InputField name="lastName" placeholder="Last name" label="Last name" />
            <InputField name="clientCompany" placeholder="Company" label="Company" />
            <InputField name="customerCode" placeholder="Customer code" label="Customer code" />
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <InputField name="clientAddress" placeholder="Billing address" label="Billing address" />
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <StateAndCitySelect />
            <InputField name="clientZip" label="Zip code" placeholder="Zip code" type={FieldType.Zip} />
          </div>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
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
          <Typography element="h2" className="mt-2 text-base">
            Contact information
          </Typography>

          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <InputField type={FieldType.Phone} name="phone" placeholder="Mobile phone" label="Mobile phone" />
            <InputField name="email" placeholder="E-mail" label="E-mail" />
            <InputField name="invoiceEmail" placeholder="Invoice e-mail" label="Invoice e-mail" />
          </div>
          <div className="flex w-full items-center gap-4">
            <div className="w-[100%]">
              <InputField
                label={isMobile ? 'Notes about client' : "Notes about client (customer won't see that)"}
                name="clientNotes"
                placeholder="Type clients notes here..."
                type={FieldType.TextArea}
              />
            </div>
          </div>
          <Typography element="h2" className="mt-2 text-base">
            Service Information
          </Typography>
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-start justify-start gap-2">
              <InputField
                name="sameBillingAddress"
                type={FieldType.Checkbox}
                placeholder="Billing address is the same than service address"
              />
            </div>
            <div className="inline-flex items-start justify-start gap-2">
              <InputField name="animalDanger" type={FieldType.Checkbox} placeholder="It must take care with animals?" />
            </div>
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
                className="h-32"
                name="poolNotes"
                placeholder="Location notes..."
                label={isMobile ? 'Notes about location' : "Notes about location (customer won't see that)"}
                type={FieldType.TextArea}
              />
            </div>
          </div>

          <Typography element="h2" className="text-base">
            Assignment Information
          </Typography>

          <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
            <SelectField
              disabled={members.length === 0}
              name="assignmentToId"
              placeholder="Technician"
              label="Technician"
              options={members.map((m) => ({
                key: m.id,
                name: m.firstName,
                value: m.id
              }))}
            />
            <SelectField label="Weekday" name="weekday" placeholder="Weekday" options={Weekdays} />
            <SelectField label="Frequency" name="frequency" placeholder="Frequency" options={Frequencies} />
          </div>

          <div className="inline-flex w-full items-start justify-start gap-4">
            <SelectField
              label="Start on"
              name="startOn"
              placeholder="Start on"
              options={next10WeekdaysStartOn.map((date) => ({
                key: date.key,
                name: date.name,
                value: date.value
              }))}
            />
            <SelectField
              label="End after"
              name="endAfter"
              placeholder="End after"
              options={next10WeekdaysEndAfter.map((date) => ({
                key: date.key,
                name: date.name,
                value: date.value
              }))}
            />
            {/* <DatePickerField
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
            /> */}
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
  frequency: defaultSchemas.frequency,
  sameBillingAddress: z.boolean(),
  assignmentToId: z.string().min(1),
  customerCode: z.string().nullable(),
  monthlyPayment: defaultSchemas.monthlyPayment,
  clientCompany: z.string().nullable(),
  clientType: z.enum(['Commercial', 'Residential']),
  timezone: defaultSchemas.timezone,
  companyOwnerId: z.string().min(1)
});

const poolAndClientSchema = clientSchema.and(poolSchema).and(additionalSchemas).and(dateSchema);
