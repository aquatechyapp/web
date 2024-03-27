import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/app/_components/ui/dialog';
import { Button } from '@/app/_components/ui/button';
import { isEmpty } from '@/utils';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import { useState } from 'react';
import TechnicianSelect from './TechnicianSelect';
import {
  useTransferOnceRoute,
  useTransferPermanentlyRoute
} from '@/hooks/react-query/assignments/useTransferRoute';
import { transferAssignmentsSchema } from '@/schemas/assignments';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import WeekdaySelect from './weekday-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/app/_components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group';
import DatePickerField from '@/app/_components/DatePickerField';
import { Assignment } from '@/interfaces/Assignments';

type Props = {
  assignmentToId: string;
  assignments: Assignment[];
};

export function DialogTransferRoute({ assignmentToId, assignments }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof transferAssignmentsSchema>>({
    resolver: zodResolver(transferAssignmentsSchema),
    defaultValues: {
      assignmentToId: assignmentToId,
      weekday: format(new Date(), 'EEEE').toUpperCase(),
      startOn: undefined,
      endAfter: undefined,
      onlyAt: undefined,
      type: 'once'
    }
  });

  const shouldTransferOnce = form.watch('type') === 'once';

  const validateForm = async (): Promise<boolean> => {
    const _ = form.formState.errors; // also works if you read form.formState.isValid
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

  const { mutate: transferOnce, isPending: isPendingOnce } =
    useTransferOnceRoute();
  const { mutate: transferPermanently, isPending: isPendingPermanently } =
    useTransferPermanentlyRoute();

  const isPending = isPendingOnce || isPendingPermanently;

  async function transferRoute() {
    const isValid = await validateForm();
    if (isValid) {
      setIsModalOpen(false);

      if (shouldTransferOnce) {
        transferOnce({
          assignmentToId: form.getValues('assignmentToId'),
          onlyAt: form.getValues('onlyAt'),
          weekday: form.getValues('weekday')
        });
      } else {
        transferPermanently({
          assignmentToId: form.getValues('assignmentToId'),
          startOn: form.getValues('startOn'),
          endAfter: form.getValues('endAfter'),
          weekday: form.getValues('weekday')
        });
      }
      form.reset();
      return;
    }

    setIsModalOpen(true);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild className="w-full">
        <Button className="w-full" variant="secondary" type="button">
          Transfer Route
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[480px]">
        <DialogTitle>Transfer Route</DialogTitle>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          <Form {...form}>
            <form>
              <TechnicianSelect
                onChange={(technicianId) =>
                  form.setValue('assignmentToId', technicianId)
                }
              />
              <WeekdaySelect
                onChange={(weekday) => form.setValue('weekday', weekday)}
              />
              <OptionsOnceOrPermanently form={form} />
              {shouldTransferOnce ? (
                <DatePickerField
                  form={form}
                  name="onlyAt"
                  placeholder="Only at"
                />
              ) : (
                <>
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
                </>
              )}
            </form>
          </Form>
        )}
        <div className="flex justify-around">
          <Button
            onClick={transferRoute}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Accept
          </Button>

          <Button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const OptionsOnceOrPermanently = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <div className="flex gap-4">
          <FormLabel>Choose between transfer...</FormLabel>
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="once" />
                  </FormControl>
                  <FormLabel className="font-normal">Once</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
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
