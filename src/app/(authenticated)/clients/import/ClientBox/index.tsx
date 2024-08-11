import { Trash } from 'lucide-react';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PoolTypes } from '@/constants';
import { FieldType } from '@/constants/enums';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { isEmpty } from '@/utils';

import { FormData, FormDataImportClients } from '../page';

type Props = {
  data: FormDataImportClients;
  index: number;
  removeClient: (index: number) => void;
};

const ClientBox = ({ data, index, removeClient }: Props) => {
  const form = useFormContext<FormData>();
  const { width } = useWindowDimensions();
  const isMobile = width ? width < 640 : false;

  const name = useMemo(() => `${index + 1} - ${data.clientName} - ${data.clientAddress}`, []);

  const hasError = form.formState.errors.clients && !isEmpty(form.formState.errors.clients[index]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="px-4 py-2">
        <AccordionTrigger className={hasError ? 'text-red-500' : undefined}>{name}</AccordionTrigger>
        <AccordionContent>
          <>
            <Button className="mb-2 pl-2" onClick={() => removeClient(index)}>
              <Trash className='className="w-4" mr-2 h-4' />
              Delete
            </Button>
            <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <InputField name={`clients.${index}.clientName`} placeholder="Client Name" label="Client Name" />
                <InputField name={`clients.${index}.clientCompany`} placeholder="Company" label="Company" />
                <InputField name={`clients.${index}.customerCode`} placeholder="Customer code" label="Customer code" />
              </div>
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <div className="min-w-fit">
                  <InputField
                    name={`clients.${index}.clientAddress`}
                    placeholder="Billing address"
                    label="Billing address"
                  />
                </div>
                <StateAndCitySelect
                  stateName={`clients.${index}.clientState`}
                  cityName={`clients.${index}.clientCity`}
                />
                <InputField
                  name={`clients.${index}.clientZip`}
                  label="Zip code"
                  placeholder="Zip code"
                  type={FieldType.Zip}
                />
                <SelectField
                  defaultValue="Residential"
                  placeholder="Client Type"
                  name={`clients.${index}.type`}
                  label="Client Type"
                  options={[
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
                  type={FieldType.Phone}
                  name={`clients.${index}.phone1`}
                  placeholder="Mobile phone"
                  label="Mobile phone"
                />
                <InputField name={`clients.${index}.email1`} placeholder="E-mail" label="E-mail" />
              </div>
              <div className="flex w-full items-center gap-4">
                <div className="w-[50%]">
                  <InputField
                    label={isMobile ? 'Notes about client' : "Notes about client (customer won't see that)"}
                    name={`clients.${index}.clientNotes`}
                    placeholder="Type clients notes here..."
                    type={FieldType.TextArea}
                  />
                </div>
              </div>
              <div className="inline-flex items-start justify-start gap-2 self-stretch">
                <InputField
                  name={`clients.${index}.animalDanger`}
                  type={FieldType.Checkbox}
                  placeholder="It must take care with animals?"
                />
              </div>
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <InputField
                  name={`clients.${index}.poolAddress`}
                  placeholder="Billing address"
                  label="Billing address"
                />
                <StateAndCitySelect stateName={`clients.${index}.poolState`} cityName={`clients.${index}.poolCity`} />
                <InputField
                  className="min-w-fit"
                  name={`clients.${index}.poolZip`}
                  label="Pool Zip code"
                  placeholder="Zip code"
                  type={FieldType.Zip}
                />
              </div>
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <InputField
                  name={`clients.${index}.monthlyPayment`}
                  placeholder="Monthly payment by client"
                  type={FieldType.CurrencyValue}
                  label="Monthly payment by client"
                />
                <InputField name={`clients.${index}.lockerCode`} placeholder="Gate code" label="Gate code" />
                <InputField name={`clients.${index}.enterSide`} placeholder="Enter side" label="Enter side" />
                <SelectField
                  name={`clients.${index}.poolType`}
                  label="Chemical type"
                  placeholder="Chemical type"
                  options={PoolTypes}
                />
              </div>
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row">
                <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
                  <InputField
                    className="h-44"
                    name={`clients.${index}.poolNotes`}
                    placeholder="Location notes..."
                    label={isMobile ? 'Notes about location' : "Notes about location (customer won't see that)"}
                    type={FieldType.TextArea}
                  />
                </div>
              </div>
            </div>
          </>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ClientBox;
