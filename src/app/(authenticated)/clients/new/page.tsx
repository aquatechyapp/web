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
import StateAndCitySelect from '@/components/ClientStateAndCitySelect';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Form, FormDescription, FormItem } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Frequencies, PoolTypes, Weekdays } from '@/constants';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { clientAxios } from '@/lib/clientAxios';
import { clientSchema } from '@/schemas/client';
import { dateSchema } from '@/schemas/date';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { poolSchema } from '@/schemas/pool';
import { useUserStore } from '@/store/user';
import { FieldType, Frequency, IanaTimeZones } from '@/ts/enums/enums';
import { createFormData } from '@/utils/formUtils';
import { isEmpty } from '@/utils';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { Stepper, useSteps } from '@/components/stepper';
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddressInput } from '@/components/AddressInput';

type PoolAndClientSchema = z.infer<typeof poolAndClientSchema>;

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { toast } = useToast();
  const { width } = useWindowDimensions();

  const isMobile = width ? width < 640 : false;

  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.user
    }))
  );

  const { data: members } = useGetMembersOfAllCompaniesByUserId(user.id);
  const { data: companies, isLoading: isCompaniesLoading, isSuccess: isCompaniesSuccess } = useGetCompanies();
  const [showNoCompaniesDialog, setShowNoCompaniesDialog] = useState(false);

  useEffect(() => {
    if (user && user.id && user.id !== undefined && isCompaniesSuccess) {
      setShowNoCompaniesDialog(companies.length === 0);
    }
  }, [companies, user, isCompaniesSuccess]);

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

  const steps = useSteps([
    {
      index: 0,
      active: true,
      complete: false,
      title: 'Client'
    },
    {
      index: 1,
      active: false,
      complete: false,
      title: 'Pool'
    },
    {
      index: 2,
      active: false,
      complete: false,
      title: 'Assignment'
    }
  ]);

  async function handleValidateClientStep() {
    const isValid = await form.trigger(
      [
        'companyOwnerId',
        'firstName',
        'lastName',
        'clientCompany',
        'customerCode',
        'clientAddress',
        'clientCity',
        'clientState',
        'clientZip',
        'clientType',
        'timezone',
        'phone',
        'email',
        'clientNotes'
      ],
      {
        shouldFocus: true
      }
    );

    if (isValid) {
      steps.nextStep();
    }
  }

  async function handleValidatePoolStep() {
    const isValid = await form.trigger(
      [
        'sameBillingAddress',
        'animalDanger',
        'poolAddress',
        'poolState',
        'poolCity',
        'poolZip',
        'monthlyPayment',
        'lockerCode',
        'enterSide',
        'poolType',
        'poolNotes'
      ],
      {
        shouldFocus: true
      }
    );

    if (isValid) {
      steps.nextStep();
    }
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: PoolAndClientSchema) => {
      console.log(data);
      return await clientAxios.post('/client-pool-assignment', createFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      router.push('/clients');
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

  const uniqueMembers = useMemo(() => {
    return members
      .filter((member) => member.firstName !== '')
      .filter((member, index, self) => index === self.findIndex((t) => t.id === member.id));
  }, [members]);

  const form = useForm<PoolAndClientSchema>({
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      animalDanger: false,
      sameBillingAddress: false,
      // clientState: user?.state,
      clientType: 'Residential',
      monthlyPayment: 0
    }
  });

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

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

    if (!isValid) {
      return;
    }
    try {
      await mutateAsync(data);
      steps.goToStep(0);
      form.reset();
      return;
    } catch (error) {
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
      <div className="p-5 lg:p-8">
        <Stepper steps={steps.stepsData} goToStep={steps.goToStep} />
      </div>

      <form onSubmit={form.handleSubmit((data) => handleCreateClientPoolAndAssignment(data))}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 p-2 lg:px-8">
          {steps.currentStepIndex === 0 && (
            <>
              <Typography element="h2" className="pb-0 text-base">
                Basic information
              </Typography>
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <SelectField
                  placeholder="Company owner"
                  name="companyOwnerId"
                  label="Company owner"
                  // defaultValue={
                  //   user.userCompanies && user.userCompanies.length === 1 ? user.userCompanies[0].companyId : ''
                  // }
                  options={
                    companies
                      .filter((c) => c.role === 'Owner' || c.role === 'Admin' || c.role === 'Office')
                      .map((c) => ({
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
                {/* <InputField name="clientAddress" placeholder="Billing address" label="Billing address" /> */}
                <AddressInput
                  name="clientAddress"
                  label="Billing address"
                  placeholder="Enter address"
                  onAddressSelect={({ state, city, zipCode, timezone }) => {
                    // First set the state
                    form.setValue('clientState', state, { shouldValidate: true });

                    // Wait for cities to load
                    setTimeout(() => {
                      form.setValue('clientCity', city, { shouldValidate: true });
                      form.setValue('clientZip', zipCode, { shouldValidate: true });
                      form.setValue('timezone', timezone, { shouldValidate: true });
                    }, 500);
                  }}
                />
              </div>
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <StateAndCitySelect />
                <InputField name="clientZip" label="Zip code" placeholder="Zip code" type={FieldType.Zip} />
              </div>
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <SelectField
                  placeholder="Client Type"
                  name="clientType"
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
              <Button
                disabled={form.formState.isValidating}
                type="button"
                className="self-end"
                onClick={handleValidateClientStep}
              >
                {form.formState.isValidating && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                Next
              </Button>
            </>
          )}
          {steps.currentStepIndex === 1 && (
            <>
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
                  <InputField
                    name="animalDanger"
                    type={FieldType.Checkbox}
                    placeholder="It must take care with animals?"
                  />
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
              <div className="flex w-full flex-1 flex-row items-center justify-between">
                <Button type="button" className="" onClick={steps.prevStep}>
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  disabled={form.formState.isValidating}
                  type="button"
                  className="self-end"
                  onClick={handleValidatePoolStep}
                >
                  {form.formState.isValidating && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                  Next
                </Button>
              </div>
            </>
          )}
          {steps.currentStepIndex === 2 && (
            <>
              <Typography element="h2" className="text-base">
                Assignment Information
              </Typography>

              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <FormItem className="w-full">
                  <SelectField
                    disabled={members.length === 0}
                    name="assignmentToId"
                    placeholder="Technician"
                    label="Technician"
                    options={uniqueMembers.map((m) => ({
                      key: m.id,
                      name: m.firstName,
                      value: m.id
                    }))}
                    defaultValue={members && members.length === 1 ? members[0].id : undefined}
                  />
                  {members.length === 0 && <FormDescription>No technicians available</FormDescription>}
                </FormItem>
                <SelectField label="Weekday" name="weekday" placeholder="Weekday" options={Weekdays} />
                <SelectField
                  label="Frequency"
                  name="frequency"
                  placeholder="Frequency"
                  defaultValue={Frequency.WEEKLY}
                  options={Frequencies}
                />
              </div>
              {form.watch('weekday') && form.watch('frequency') && (
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
                </div>
              )}

              <div className="flex w-full flex-1 flex-row items-center justify-between">
                <Button type="button" className="" onClick={steps.prevStep}>
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button disabled={isPending} type="submit">
                  {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                  Add client
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
      <Dialog
        open={!isCompaniesLoading && isCompaniesSuccess && showNoCompaniesDialog}
        onOpenChange={setShowNoCompaniesDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">No Companies Available</DialogTitle>
            <DialogDescription>Please create a company before adding a client.</DialogDescription>
          </DialogHeader>
          <Button onClick={() => router.push('/team/myCompanies')}>Create Company</Button>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

const additionalSchemas = z.object({
  weekday: defaultSchemas.weekday,
  frequency: defaultSchemas.frequency,
  sameBillingAddress: z.boolean(),
  assignmentToId: z.string().min(1),
  customerCode: z.string().nullable().optional(),
  monthlyPayment: defaultSchemas.monthlyPayment,
  clientCompany: z.string().nullable().optional(),
  clientType: z.enum(['Commercial', 'Residential']),
  timezone: defaultSchemas.timezone,
  companyOwnerId: z.string().min(1)
});

const poolAndClientSchema = clientSchema.and(poolSchema).and(additionalSchemas).and(dateSchema);
