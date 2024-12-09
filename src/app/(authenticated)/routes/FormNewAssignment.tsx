import { format, getDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// import DatePickerField from '@/components/DatePickerField';
import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Form } from '@/components/ui/form';
import { Frequencies } from '@/constants';
import useGetClients from '@/hooks/react-query/clients/getClients';
// import { useDisabledWeekdays } from '@/hooks/useDisabledWeekdays';
import { FieldType } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';
import { buildSelectOptions } from '@/utils/formUtils';

import { FormSchema } from './page';

export const FormNewAssignment = () => {
  const form = useFormContext<FormSchema>();

  const [startOn, weekday] = form.watch(['startOn', 'weekday']);
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

  // const disabledWeekdays = useDisabledWeekdays();
  const { data: clients, isLoading } = useGetClients();

  useEffect(() => {
    form.resetField('startOn');
    form.resetField('endAfter');
    getNext10DatesForEndAfterBasedOnWeekday(startOn);
    getNext10DatesForStartOnBasedOnWeekday(weekday);
  }, [form.watch('weekday')]);

  useEffect(() => {
    getNext10DatesForEndAfterBasedOnWeekday(form.watch('startOn'));
  }, [form.watch('startOn')]);

  if (isLoading) return <LoadingSpinner />;

  const clientId = form.watch('client');

  const hasClients = clients.length > 0;

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
      const isoDate = String(nextDate);

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

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <Form {...form}>
      <form className="flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <SelectField
              options={clients
                .filter((c: Client) => c.pools.length > 0)
                .map((c: Client) => ({
                  key: c.id,
                  name: `${c.firstName} ${c.lastName}`,
                  value: c.id
                }))}
              label="Clients"
              placeholder={hasClients ? 'Client' : 'No clients available'}
              name="client"
            />
            {clientId && (
              <SelectField
                options={buildSelectOptions(
                  // Procura a piscina somente quando seleciona o cliente
                  clients.find((c: Client) => c.id === clientId)?.pools,
                  {
                    key: 'id',
                    name: 'name',
                    value: 'id'
                  }
                )}
                label="Location"
                placeholder="Location"
                name="poolId"
              />
            )}
          </div>
          <div className="flex gap-4">
            <SelectField name="frequency" placeholder="Frequency" label="Frequency" options={Frequencies} />
            <InputField
              name="paidByService"
              placeholder="$0.00"
              label="Paid by Service"
              type={FieldType.CurrencyValue}
            />
          </div>

          <div className="mt-4 flex gap-4">
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
              disabled={[{ before: new Date() }, { dayOfWeek: disabledWeekdays }]}
              name="startOn"
              placeholder="Start on"
            />

            <DatePickerField
              disabled={[{ before: new Date() }, { dayOfWeek: disabledWeekdays }]}
              name="endAfter"
              placeholder="End after"
            /> */}
          </div>
        </div>
      </form>
    </Form>
  );
};
