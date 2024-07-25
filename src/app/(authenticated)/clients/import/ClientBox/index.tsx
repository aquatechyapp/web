import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PoolTypes } from '@/constants';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { ImportMultipleClients } from '@/interfaces/Client';
import { clientSchema } from '@/schemas/client';
import { poolSchema } from '@/schemas/pool';
import { useFormStore } from '@/store/importClients';
import { isEmpty } from '@/utils';
import { validateForm } from '@/utils/formUtils';

type Props = {
  data: ImportMultipleClients;
  index: number;
  hasErrorInSomeForm: boolean;
  setHasErrorInSomeForm: (value: boolean) => void;
};

const ClientBox = ({ data, index, hasErrorInSomeForm, setHasErrorInSomeForm }: Props) => {
  const { width } = useWindowDimensions();
  const isMobile = width ? width < 640 : false;

  const { updateFormValues, removeForm, forms } = useFormStore();

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: { ...data }
  });

  useEffect(() => {
    // Update the context initially with default values
    updateFormValues(index, form.getValues());

    // Update the context whenever form values change
    const subscription = form.watch((values) => {
      updateFormValues(index, values);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Bug ao deletar
    // data.monthlyPayment = onlyNumbers(data.monthlyPayment) || '';
    // data.animalDanger = !!data.animalDanger
    // data.clientType = data.clientType || 'Residential';
    // data.poolType = data.poolType || null;
    form.reset(data);
    validateForm(form);
  }, [forms.length]);

  const name = useMemo(
    () => `${index + 1} - ${form.getValues('clientName')} - ${form.getValues('clientAddress')}`,
    [form.watch('clientName'), form.watch('clientAddress')]
  );

  useEffect(() => {
    validateForm(form);
  }, []);

  useEffect(
    () => {
      if (!hasErrorInSomeForm && !form.formState.isValid) {
        setHasErrorInSomeForm(true);
      } else if (hasErrorInSomeForm && form.formState.isValid) {
        setHasErrorInSomeForm(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.formState.isValid]
  );

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="px-4 py-2">
        <AccordionTrigger
          className={!isEmpty(form.formState.errors) && !form.formState.isValid ? 'text-red-500' : undefined}
        >
          {name}
        </AccordionTrigger>
        <AccordionContent>
          <>
            <Button
              className="mb-2 pl-2"
              onClick={() => {
                removeForm(index);
              }}
            >
              <Trash className='className="w-4" mr-2 h-4' />
              Delete
            </Button>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => {})}>
                <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
                  <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                    <InputField form={form} name="clientName" placeholder="Client Name" label="Client Name" />
                    <InputField form={form} name="clientCompany" placeholder="Company" label="Company" />
                    <InputField form={form} name="customerCode" placeholder="Customer code" label="Customer code" />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                    <div className="min-w-fit">
                      <InputField
                        form={form}
                        name="clientAddress"
                        placeholder="Billing address"
                        label="Billing address"
                      />
                    </div>
                    <StateAndCitySelect form={form} />
                    <InputField form={form} name="clientZip" label="Zip code" placeholder="Zip code" type="zip" />
                    <SelectField
                      defaultValue="Residential"
                      placeholder="Client Type"
                      form={form}
                      name="type"
                      label="Client Type"
                      data={[
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
                  </div>
                  <div className="mt-4 flex w-full items-center whitespace-nowrap text-sm font-medium text-gray-500">
                    <span className="mr-2">Contact information</span>
                  </div>
                  <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                    <InputField
                      type="phone"
                      form={form}
                      name="phone1"
                      placeholder="Mobile phone"
                      label="Mobile phone"
                    />
                    <InputField form={form} name="email1" placeholder="E-mail" label="E-mail" />
                  </div>
                  <div className="flex w-full items-center gap-4">
                    <div className="w-[50%]">
                      <InputField
                        label={isMobile ? 'Notes about client' : "Notes about client (customer won't see that)"}
                        name="clientNotes"
                        form={form}
                        placeholder="Type clients notes here..."
                        type="textArea"
                      />
                    </div>
                  </div>
                  <div className="inline-flex items-start justify-start gap-2 self-stretch">
                    <InputField
                      form={form}
                      name="animalDanger"
                      type="checkbox"
                      placeholder="It must take care with animals?"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                    <InputField form={form} name="poolAddress" placeholder="Billing address" label="Billing address" />
                    <StateAndCitySelect form={form} stateName="poolState" cityName="poolCity" />
                    <InputField
                      className="min-w-fit"
                      form={form}
                      name="poolZip"
                      label="Pool Zip code"
                      placeholder="Zip code"
                      type="zip"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                    <InputField
                      form={form}
                      name="monthlyPayment"
                      placeholder="Monthly payment by client"
                      type="currencyValue"
                      label="Monthly payment by client"
                    />
                    <InputField form={form} name="lockerCode" placeholder="Gate code" label="Gate code" />
                    <InputField form={form} name="enterSide" placeholder="Enter side" label="Enter side" />
                    <SelectField
                      name="poolType"
                      label="Chemical type"
                      placeholder="Chemical type"
                      form={form}
                      data={PoolTypes}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
                      <InputField
                        className="h-44"
                        name="poolNotes"
                        form={form}
                        placeholder="Location notes..."
                        label={isMobile ? 'Notes about location' : "Notes about location (customer won't see that)"}
                        type="textArea"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const additionalSchemas = z.object({
  customerCode: z.string().nullable(),
  monthlyPayment: z.number(),
  clientCompany: z.string().nullable(),
  clientType: z.enum(['Commercial', 'Residential']),
  clientName: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.'
    })
    .trim()
    .min(1, { message: 'First name must be at least 1 character.' })
});

const poolAndClientSchema = clientSchema
  .omit({
    firstName: true,
    lastName: true
  })
  .and(poolSchema)
  .and(additionalSchemas);

export default ClientBox;
