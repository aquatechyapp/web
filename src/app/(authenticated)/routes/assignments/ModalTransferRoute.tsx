import { zodResolver } from '@hookform/resolvers/zod';
import { format, getDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useTransferPermanentlyRoute } from '@/hooks/react-query/assignments/useTransferRoute';
import { transferAssignmentsSchema } from '@/schemas/assignments';
import { useUserStore } from '@/store/user';
import { useWeekdayStore } from '@/store/weekday';
import { Assignment, TransferAssignment } from '@/ts/interfaces/Assignments';
import { WeekdaysUppercase } from '@/ts/interfaces/Weekday';
import { isEmpty } from '@/utils';

import WeekdaySelect from './WeekdaySelect';
import { useMembersStore } from '@/store/members';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  assignment?: Assignment;
  isEntireRoute?: boolean;
};

type FormValues = z.infer<typeof transferAssignmentsSchema>;

export function DialogTransferRoute({ open, setOpen, assignment, isEntireRoute = false }: Props) {
  const { members, assignmentToId } = useMembersStore(
    useShallow((state) => ({
      members: state.members,
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
      startOn: undefined,
      endAfter: undefined,
      isEntireRoute
    }
  });

  const [startOn, weekday] = form.watch(['startOn', 'weekday']);

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

  const handleTransferSuccess = () => {
    setManualLoading(false); // Clear manual loading state
    form.reset();
    setOpen(false);
  };

  const handleTransferError = () => {
    setManualLoading(false); // Clear manual loading state on error
  };

  const { mutate: transferPermanently, isPending: isPendingPermanently } = useTransferPermanentlyRoute(assignment, handleTransferSuccess, handleTransferError);
  const [manualLoading, setManualLoading] = useState(false);

  const isPending = isPendingPermanently || manualLoading;

  const buildPayload = () => {
    const { weekday, startOn, endAfter } = form.getValues();
    const assignmentToId = form.watch('assignmentToId');

    const payload = {
      assignmentToId,
      startOn,
      endAfter,
      weekday
    };

    return payload;
  };

  async function transferRoute() {
    const isValid = await validateForm();
    if (isValid) {
      const payload = buildPayload();
      setManualLoading(true); // Set manual loading state
      transferPermanently(payload as TransferAssignment);
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

  // Create a new members array don't including repeated members and removing members with firstName empty
  const uniqueMembers = members.filter(
    (member, index, self) => index === self.findIndex((t) => t.id === member.id) && member.firstName !== ''
  );

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
    <Dialog open={open} onOpenChange={isPending ? undefined : setOpen}>
      <DialogContent className="max-h-screen w-96 max-w-[580px] overflow-y-scroll rounded-md md:w-[580px]">
        <DialogTitle>Transfer Route</DialogTitle>
        {isPending ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
            <p className="text-sm text-gray-600">Transferring assignments...</p>
          </div>
        ) : (
          <>
            <Form {...form}>
              <form className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="basis-full">
                    <SelectField
                      name="assignmentToId"
                      placeholder="Technician..."
                      label="Technician"
                      options={uniqueMembers.map((m) => ({
                        key: m.id,
                        value: m.id,
                        name: `${m.firstName} ${m.lastName}`
                      }))}
                    />
                  </div>

                  <WeekdaySelect
                    value={form.watch('weekday')}
                    onChange={(weekday: WeekdaysUppercase) => form.setValue('weekday', weekday)}
                  />
                </div>

                <div className="mt-1">
                  <div className="flex flex-col gap-4 md:flex-row">
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
                </div>
              </form>
            </Form>
            <div className="flex justify-around">
              <Button onClick={transferRoute}>Accept</Button>

              <Button
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
