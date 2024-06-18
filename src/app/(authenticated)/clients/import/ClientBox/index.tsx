import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form } from '@/components/ui/form';
import { PoolTypes } from '@/constants';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { paidByServiceSchema } from '@/schemas/assignments';
import { clientSchema } from '@/schemas/client';
import { dateSchema } from '@/schemas/date';
import { poolSchema } from '@/schemas/pool';
import { isEmpty } from '@/utils';

type Props = {
  data: any;
  index: number;
};

const ClientBox = memo(function ClientBox({ data, index }: Props) {
  const { width } = useWindowDimensions();

  const isMobile = width ? width < 640 : false;

  const form = useForm<z.infer<typeof poolAndClientSchema>>({
    mode: 'onChange',
    resolver: zodResolver(poolAndClientSchema),
    defaultValues: {
      monthlyPayment: data.monthlyPayment || '',

      // Client data
      clientAddress: data.clientAddress || '',
      clientCity: data.clientCity || '',
      customerCode: data.customerCode || undefined,
      email1: data.email1 || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      clientNotes: data.clientNotes || '',
      clientZip: data.clientZip || '',
      clientState: data.clientState || '',
      clientCompany: data.clientCompany || '',
      clientType: data.clientType || 'Residential',
      phone1: data.phone1 || '',

      // Pool data
      poolAddress: data.poolAddress || '',
      poolCity: data.poolCity || '',
      poolState: data.poolState || '',
      poolZip: data.poolZip || '',
      poolNotes: data.poolNotes || '',
      animalDanger: !!data.animalDanger || '',
      enterSide: data.enterSide || '',
      lockerCode: data.lockerCode || ''
    }
  });

  const name = `${index + 1} - ${form.getValues('firstName')} ${form.getValues('lastName')} - ${form.getValues('clientAddress')}`;
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

  useEffect(() => {
    validateForm();
  }, []);

  console.log(form.getValues());

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="px-4 py-2">
        <AccordionTrigger className={!isEmpty(form.formState.errors) && 'text-red-500'}>{name}</AccordionTrigger>
        <AccordionContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
                <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                  <InputField form={form} name="firstName" placeholder="First name" label="First name" />
                  <InputField form={form} name="lastName" placeholder="Last name" label="Last name" />
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
                  <InputField form={form} name="invoiceEmail" placeholder="Invoice e-mail" label="Invoice e-mail" />
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
});

const additionalSchemas = z.object({
  customerCode: z.string().nullable(),
  monthlyPayment: z.number().nullable(),
  clientCompany: z.string().nullable(),
  clientType: z.enum(['Commercial', 'Residential'])
});

const poolAndClientSchema = clientSchema.and(poolSchema).and(additionalSchemas).and(dateSchema);

export default ClientBox;
