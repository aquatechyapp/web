import { zodResolver } from '@hookform/resolvers/zod';
import { format, getDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import SelectField from '@/components/SelectField';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useTransferPermanentlyRoute, TransferResponse } from '@/hooks/react-query/assignments/useTransferRoute';
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

export function DialogTransferCompleteRoute({ open, setOpen, assignment, isEntireRoute = false }: Props) {
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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transferResults, setTransferResults] = useState<TransferResponse | null>(null);

  const handleTransferSuccess = (result: TransferResponse) => {
    setManualLoading(false); // Clear manual loading state
    setTransferResults(result); // Store the results to display
    form.reset();
    setOpen(false);
  };

  const handleTransferError = (error: string) => {
    setManualLoading(false); // Clear manual loading state on error
    setErrorMessage(error); // Set error message to display in dialog
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
    <>
      <Dialog open={open} onOpenChange={isPending ? undefined : setOpen}>
        <DialogContent className="max-h-screen w-96 max-w-[580px] overflow-y-scroll rounded-md md:w-[580px]">
          <DialogTitle>Transfer Complete Route</DialogTitle>

          <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                    <p className="font-semibold">You are about to transfer all assignments.</p>
                    <p className="mt-1">Single services will be transferred as single services to the new date, they will not be recurrent.</p>
                    <p className="mt-1">Recurrent services will be transferred and will assume the dates you selected.</p>
                  </div>
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
              <div className="flex justify-around gap-4 pt-4">
                <Button onClick={transferRoute} className='w-full'>Transfer</Button>

                <Button
                  variant="outline"
                  className='w-full'
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

      {/* Error Dialog */}
      <AlertDialog open={!!errorMessage} onOpenChange={(open) => !open && setErrorMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Transferring Route</AlertDialogTitle>
            <AlertDialogDescription className="text-red-600">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Results Dialog */}
      <AlertDialog open={!!transferResults} onOpenChange={(open) => !open && setTransferResults(null)}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {transferResults?.failureCount === 0 ? (
                <span className="text-green-600">✓ All Assignments Transferred Successfully</span>
              ) : transferResults?.successCount === 0 ? (
                <span className="text-red-600">Transfer Failed</span>
              ) : (
                <span className="text-yellow-600">Partial Transfer Completed</span>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div className="grid grid-cols-3 gap-4 py-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">{transferResults?.totalProcessed}</div>
                  <div className="text-gray-500">Total Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{transferResults?.successCount}</div>
                  <div className="text-gray-500">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{transferResults?.failureCount}</div>
                  <div className="text-gray-500">Failed</div>
                </div>
              </div>

              {transferResults && transferResults.failureCount > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Failed Transfers:</div>
                  
                    {transferResults.results
                      .filter((result) => !result.success)
                      .map((result, index) => (
                        <div key={result.assignmentId || index} className="p-3 bg-white rounded border border-red-200 mb-2 mt-2">
                          <div className="text-sm text-red-700">{result.message}</div>
                        </div>
                      ))}
                  
                </div>
              )}

              {transferResults && transferResults.successCount > 0 && transferResults.failureCount > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                  <strong>Note:</strong> {transferResults.successCount} assignment(s) were transferred successfully. 
                  The failed transfers above were skipped and may require manual attention.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setTransferResults(null)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
