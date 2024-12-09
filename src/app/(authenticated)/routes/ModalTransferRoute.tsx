import { zodResolver } from '@hookform/resolvers/zod';
import { format, getDay } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import DatePickerField from '@/components/DatePickerField';
import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTransferOnceRoute, useTransferPermanentlyRoute } from '@/hooks/react-query/assignments/useTransferRoute';
import { useDisabledWeekdays } from '@/hooks/useDisabledWeekdays';
import { transferAssignmentsSchema } from '@/schemas/assignments';
import { useTechniciansStore } from '@/store/technicians';
import { useUserStore } from '@/store/user';
import { useWeekdayStore } from '@/store/weekday';
import { FieldType } from '@/ts/enums/enums';
import { Assignment, TransferAssignment } from '@/ts/interfaces/Assignments';
import { WeekdaysUppercase } from '@/ts/interfaces/Weekday';
import { isEmpty } from '@/utils';

import WeekdaySelect from './WeekdaySelect';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  assignment?: Assignment;
  isEntireRoute?: boolean;
};

type FormValues = z.infer<typeof transferAssignmentsSchema>;

export function DialogTransferRoute({ open, setOpen, assignment, isEntireRoute = false }: Props) {
  const { technicians, assignmentToId } = useTechniciansStore(
    useShallow((state) => ({
      technicians: state.technicians,
      assignmentToId: state.assignmentToId
    }))
  );
  const selectedWeekday = useWeekdayStore((state) => state.selectedWeekday);
  const user = useUserStore((state) => state.user);
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

  const form = useForm<FormValues>({
    resolver: zodResolver(transferAssignmentsSchema),
    defaultValues: {
      assignmentToId: assignmentToId,
      weekday: selectedWeekday,
      paidByService: assignment?.paidByService || undefined,
      startOn: undefined,
      endAfter: undefined,
      onlyAt: undefined,
      type: 'once',
      isEntireRoute
    }
  });

  const [startOn, weekday] = form.watch(['startOn', 'weekday']);

  const disabledWeekdays = useDisabledWeekdays(form.watch('weekday'));

  const userSelectedAsTechnician = useMemo(
    () => user.id === form.watch('assignmentToId'),
    [form.watch('assignmentToId')]
  );

  useEffect(() => {
    if (userSelectedAsTechnician) {
      form.setValue('paidByService', 0);
    } else {
      if (assignment) {
        form.setValue('paidByService', assignment?.paidByService);
      }
    }
  }, [form.watch('assignmentToId'), open]);

  const shouldTransferOnce = form.watch('type') === 'once';

  const validateForm = async (): Promise<boolean> => {
    form.formState.errors; // also works if you read form.formState.isValid
    await form.trigger();
    if (form.formState.isValid) {
      return true;
    }
    if (isEmpty(form.formState.errors)) {
      console.error('Error in the form');
    } else {
      console.error(form.formState.errors);
    }
    return false;
  };

  const { mutate: transferOnce, isPending: isPendingOnce } = useTransferOnceRoute(assignment);
  const { mutate: transferPermanently, isPending: isPendingPermanently } = useTransferPermanentlyRoute(assignment);

  const isPending = isPendingOnce || isPendingPermanently;

  const buildPayload = () => {
    const { onlyAt, weekday, paidByService, startOn, endAfter } = form.getValues();
    const assignmentToId = form.watch('assignmentToId');
    // const paidByServiceValue =
    //   typeof paidByService === 'string' ? parseInt(paidByService?.replaceAll(/\D/g, '')) : paidByService;

    let payload: TransferAssignmentsOnce | TransferAssignmentsPermanently;

    if (shouldTransferOnce) {
      payload = {
        assignmentToId,
        onlyAt,
        weekday,
        // paidByService: paidByServiceValue
        paidByService
      };
    } else {
      payload = {
        assignmentToId,
        startOn,
        endAfter,
        weekday,
        // paidByService: paidByServiceValue
        paidByService
      };
    }

    if (userSelectedAsTechnician) {
      delete payload.paidByService;
    }

    return payload;
  };

  async function transferRoute() {
    const isValid = await validateForm();
    if (isValid) {
      const payload = buildPayload();
      setOpen(false);
      if (shouldTransferOnce) {
        transferOnce(payload as TransferAssignmentsOnce);
      } else {
        transferPermanently(payload as TransferAssignment);
      }
      form.reset();
      return;
    }
    setOpen(true);
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

  useEffect(() => {
    form.resetField('startOn');
    form.resetField('endAfter');

    if (startOn) {
      getNext10DatesForEndAfterBasedOnWeekday(startOn);
    }

    getNext10DatesForStartOnBasedOnWeekday(weekday);
  }, [form.watch('weekday')]);

  useEffect(() => {
    if (startOn) {
      getNext10DatesForEndAfterBasedOnWeekday(form.watch('startOn')!);
    }
  }, [form.watch('startOn')]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen w-96 max-w-[580px] overflow-y-scroll rounded-md md:w-[580px]">
        <DialogTitle>Transfer Route</DialogTitle>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          <Form {...form}>
            <form className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="basis-full">
                  <SelectField
                    name="assignmentToId"
                    placeholder="Technician..."
                    label="Technician"
                    options={technicians.map((t) => ({
                      key: t.subcontractorId,
                      value: t.subcontractorId,
                      name: `${t.subcontractor.firstName} ${t.subcontractor.lastName}`
                    }))}
                  />
                </div>
                {/* quando for transferir rota inteira, não preciso informar paidByService, ele pega de cada assignment */}
                {!userSelectedAsTechnician && (
                  <InputField
                    name="paidByService"
                    placeholder="$0.00"
                    label="Paid by Service"
                    type={FieldType.CurrencyValue}
                  />
                )}
                <WeekdaySelect
                  value={form.watch('weekday')}
                  onChange={(weekday: WeekdaysUppercase) => form.setValue('weekday', weekday)}
                />
              </div>

              <OptionsOnceOrPermanently form={form} />
              <div className="mt-1">
                {shouldTransferOnce ? (
                  <DatePickerField
                    disabled={[{ before: new Date() }, { dayOfWeek: disabledWeekdays }]}
                    name="onlyAt"
                    placeholder="Select Date"
                  />
                ) : (
                  <div className="flex flex-col gap-4 md:flex-row">
                    {/* <DatePickerField
                      disabled={[{ before: new Date() }, { dayOfWeek: disabledWeekdays }]}
                      name="startOn"
                      placeholder="Start on"
                    />
                    <DatePickerField
                      disabled={[{ before: new Date() }, { dayOfWeek: disabledWeekdays }]}
                      name="endAfter"
                      placeholder="End after"
                    /> */}
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
              </div>
            </form>
          </Form>
        )}
        <div className="flex justify-around">
          <Button onClick={transferRoute}>Accept</Button>

          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              form.reset();
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const OptionsOnceOrPermanently = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <div className="flex gap-4">
          <FormItem className="space-y-3">
            <FormLabel>Choose between transfer...</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="once" />
                  </FormControl>
                  <FormLabel className="font-normal">Once</FormLabel>
                </FormItem>
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  // Necessário pois tinha um space-y aplicando um margin-top
                  style={{ marginTop: 0 }}
                >
                  <FormControl>
                    <RadioGroupItem value="permanently" />
                  </FormControl>
                  <FormLabel className="font-normal">Permanently</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
};

type TransferAssignments = {
  assignmentToId: string;
  weekday: WeekdaysUppercase;
  paidByService?: number | null;
};

type TransferAssignmentsOnce = TransferAssignments & {
  onlyAt?: Date;
};

type TransferAssignmentsPermanently = TransferAssignments & {
  startOn: Date;
  endAfter: Date | string;
};
