import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PoolTypes } from '@/constants';
import { useFormContext } from '@/context/importClients';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { clientSchema } from '@/schemas/client';
import { poolSchema } from '@/schemas/pool';
import { isEmpty, onlyNumbers } from '@/utils';
import { validateForm } from '@/utils/formUtils';

type Props = {
  data: any;
  index: number;
  hasErrorInSomeForm: boolean;
  setHasErrorInSomeForm: (value: boolean) => void;
};

const ClientBox = ({ data, index, hasErrorInSomeForm, setHasErrorInSomeForm }: Props) => {
  const { width } = useWindowDimensions();
  const isMobile = width ? width < 640 : false;

  const { updateFormValues, removeForm, forms } = useFormContext();

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      monthlyPayment: onlyNumbers(data.monthlyPayment) || undefined,
      // Client data
      clientAddress: data.clientAddress || '',
      clientCity: data.clientCity || '',
      clientName: data.clientName || '',
      customerCode: data.customerCode || undefined,
      email1: data.email1 || '',
      // firstName: data.firstName || '',
      // lastName: data.lastName || '',
      clientNotes: data.clientNotes || '',
      clientZip: data.clientZip || '',
      clientState: data.clientState || '',
      clientCompany: data.clientCompany || '',
      clientType: data.clientType || 'Residential',
      phone1: onlyNumbers(data.phone1).toString() || '',

      // Pool data
      poolAddress: data.poolAddress || '',
      poolCity: data.poolCity || '',
      poolState: data.poolState || '',
      poolZip: data.poolZip || '',
      poolType: data.poolType || '',
      poolNotes: data.poolNotes || '',
      animalDanger: !!data.animalDanger || '',
      enterSide: data.enterSide || '',
      lockerCode: data.lockerCode || ''
    }
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

  useEffect(() => {
    form.trigger();
  }, [forms.length]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="px-4 py-2">
        {/* <Button
          onClick={() => {
            removeForm(index);
          }}
        >
          Remove
        </Button> */}
        <AccordionTrigger className={!isEmpty(form.formState.errors) && 'text-red-500'}>{name}</AccordionTrigger>
        <AccordionContent>
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
                  <InputField type="phone" form={form} name="phone1" placeholder="Mobile phone" label="Mobile phone" />
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const additionalSchemas = z.object({
  customerCode: z.string().nullable(),
  monthlyPayment: z.number().nullable(),
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
