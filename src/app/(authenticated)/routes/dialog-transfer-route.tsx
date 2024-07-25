import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import CalendarField from '@/components/CalendarField';
import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTransferOnceRoute, useTransferPermanentlyRoute } from '@/hooks/react-query/assignments/useTransferRoute';
import { useDisabledWeekdays } from '@/hooks/useDisabledWeekdays';
import { Assignment } from '@/interfaces/Assignments';
import { WeekdaysUppercase } from '@/interfaces/Weekday';
import { transferAssignmentsSchema } from '@/schemas/assignments';
import { useTechniciansStore } from '@/store/technicians';
import { useUserStore } from '@/store/user';
import { useWeekdayStore } from '@/store/weekday';
import { isEmpty } from '@/utils';

import WeekdaySelect from './weekday-select';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  assignment?: Assignment;
  isEntireRoute?: boolean;
};

type FormValues = z.infer<typeof transferAssignmentsSchema>;

export function DialogTransferRoute({ open, setOpen, assignment, isEntireRoute = false }: Props) {
  const { technicians, assignmentToId } = useTechniciansStore();
  const selectedWeekday = useWeekdayStore((state) => state.selectedWeekday);
  const user = useUserStore((state) => state.user);

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

  console.log(typeof form.watch('startOn'));

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
        transferPermanently(payload as TransferAssignmentsPermanently);
      }
      form.reset();
      return;
    }
    setOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen max-w-[580px] overflow-y-scroll">
        <DialogTitle>Transfer Route</DialogTitle>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          <Form {...form}>
            <form className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="basis-full">
                  {/* -mb-4 pra remover o gap-4. Não coloquei a Label dentro do componente pois não quero aplicar sempre */}
                  <Label className="-mb-4">Technician</Label>
                  <div className="mt-2">
                    {/* por padrão, o User logado é o tecnico selecionado */}
                    <SelectField
                      name="assignmentToId"
                      form={form}
                      placeholder="Technician..."
                      data={technicians.map((t) => ({
                        key: t.subcontractor.id,
                        value: t.subcontractor.id,
                        name: `${t.subcontractor.firstName} ${t.subcontractor.lastName}`
                      }))}
                    />
                  </div>
                </div>
                {/* quando for transferir rota inteira, não preciso informar paidByService, ele pega de cada assignment */}
                {!userSelectedAsTechnician && (
                  <InputField
                    name="paidByService"
                    form={form}
                    placeholder="0.00$"
                    label="Paid by Service"
                    type="currencyValue"
                  />
                )}
                <div className="basis-full">
                  <WeekdaySelect
                    value={form.watch('weekday')}
                    onChange={(weekday: WeekdaysUppercase) => form.setValue('weekday', weekday)}
                  />
                </div>
              </div>

              <OptionsOnceOrPermanently form={form} />
              <div className="mt-1">
                {shouldTransferOnce ? (
                  <CalendarField disabledWeekdays={disabledWeekdays} form={form} name="onlyAt" placeholder="Only at" />
                ) : (
                  <div className="flex flex-col md:flex-row">
                    <CalendarField
                      disabledWeekdays={disabledWeekdays}
                      form={form}
                      name="startOn"
                      placeholder="Start on"
                    />
                    <CalendarField
                      disabledWeekdays={disabledWeekdays}
                      form={form}
                      name="endAfter"
                      placeholder="End after"
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
  onlyAt?: string;
};

type TransferAssignmentsPermanently = TransferAssignments & {
  startOn: string;
  endAfter: string;
};
