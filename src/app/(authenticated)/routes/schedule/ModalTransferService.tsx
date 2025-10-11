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

import { useWeekdayStore } from '@/store/weekday';
import { WeekdaysUppercase } from '@/ts/interfaces/Weekday';
import { isEmpty } from '@/utils';

import { useMembersStore } from '@/store/members';
import WeekdaySelect from '../assignments/WeekdaySelect';
import { Service, TransferService } from '@/ts/interfaces/Service';
import { transferServiceSchema } from '@/schemas/service';
import { useTransferService } from '@/hooks/react-query/services/transferService';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  service: Service;
};

type FormValues = z.infer<typeof transferServiceSchema>;

export function DialogTransferService({ open, setOpen, service }: Props) {
  const { members } = useMembersStore(
    useShallow((state) => ({
      members: state.members,
      assignmentToId: state.assignmentToId
    }))
  );

  // Create a new members array don't including repeated members and removing members with firstName empty
  const uniqueMembers = members.filter(
    (member, index, self) => index === self.findIndex((t) => t.id === member.id) && member.firstName !== ''
  );

  const selectedWeekday = useWeekdayStore((state) => state.selectedWeekday);
  const [weekday, setWeekday] = useState<WeekdaysUppercase>(selectedWeekday);

  const [next10DatesWithChosenWeekday, setNext10DatesWithChosenWeekday] = useState<
    {
      name: string;
      key: string;
      value: string;
    }[]
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(transferServiceSchema),
    defaultValues: {
      assignedToId: '',
      scheduledTo: ''
    }
  });

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

  const { mutate, isPending } = useTransferService();

  const buildPayload = () => {
    const { assignedToId, scheduledTo, serviceId } = form.getValues();

    const payload: TransferService = {
      serviceId,
      assignedToId,
      scheduledTo
    };

    return payload;
  };

  async function transferService() {
    form.setValue('serviceId', service.id);

    const isValid = await validateForm();
    if (isValid) {
      const payload = buildPayload();
      // Send as array with single item to match new API
      mutate([payload], {
        onSuccess: () => {
          form.reset();
          setWeekday(selectedWeekday);
          setNext10DatesWithChosenWeekday([]);
          setOpen(false);
        }
      });
      return;
    }
    setOpen(true);
  }

  function getNext10DatesBasedOnWeekday(weekday: string) {
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

    setNext10DatesWithChosenWeekday(dates);
  }

  useEffect(() => {
    if (weekday) {
      getNext10DatesBasedOnWeekday(weekday);
    }
  }, [weekday]);

  return (
    <Dialog
      open={open}
      onOpenChange={
        isPending
          ? undefined
          : (isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                setTimeout(() => {
                  form.reset();
                  setWeekday(selectedWeekday);
                  setNext10DatesWithChosenWeekday([]);
                }, 0);
              }
            }
      }
    >
      <DialogContent className="max-h-screen w-96 max-w-[580px] overflow-y-scroll rounded-md md:w-[580px]">
        <DialogTitle>Transfer Service</DialogTitle>
        {isPending ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-sm text-gray-600">Transferring service...</p>
          </div>
        ) : (
          <Form {...form}>
            <form className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="basis-full">
                  <SelectField
                    name="assignedToId"
                    placeholder="Technician..."
                    label="Technician"
                    options={uniqueMembers.map((m) => ({
                      key: m.id,
                      value: m.id,
                      name: `${m.firstName} ${m.lastName}`
                    }))}
                  />
                </div>

                <WeekdaySelect value={weekday} onChange={(weekday: WeekdaysUppercase) => setWeekday(weekday)} />
              </div>

              <div className="mt-1">
                <div className="flex flex-col gap-4 md:flex-row">
                  <SelectField
                    label="Schedule to"
                    name="scheduledTo"
                    placeholder="Schedule to"
                    options={next10DatesWithChosenWeekday.map((date) => ({
                      key: date.key,
                      name: date.name,
                      value: date.value
                    }))}
                  />
                </div>
              </div>
            </form>
          </Form>
        )}
        {!isPending && (
          <div className="flex justify-around gap-4 pt-4">
            <Button className="w-full" onClick={transferService}>
              Transfer
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                form.reset();
                setWeekday(selectedWeekday);
                setNext10DatesWithChosenWeekday([]);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
