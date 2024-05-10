'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import DatePickerField from '@/components/DatePickerField';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TimeField } from '@/components/ui/time-field';
import { paymentType } from '@/constants';
import useGetClients from '@/hooks/react-query/clients/getClients';

export default function Page() {
  const { data: clientsData } = useGetClients();

  const form = useForm({
    defaultValues: {
      Citys: '',
      type: ''
    }
  });

  const types = Array.from(new Set(clientsData?.map((client) => client.type) ?? []));
  const typesSelectOptions = types.map((type) => ({ value: type, name: type }));

  // console.log(clientsData);
  const [timeValue, setTimeValue] = useState(null);

  const handleTimeChange = (newValue) => {
    setTimeValue(newValue); // Atualiza o estado com o novo valor do campo de tempo
  };

  const handleSubmit = (formData) => {
    // Adicione o valor do campo de tempo aos dados do formulário
    const formDataWithTime = { ...formData, hours: timeValue };
    console.log('Dados do formulário:', formDataWithTime);
    // Agora você pode enviar formDataWithTime para a API
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="text-black-500 text-xl font-semibold">Broadcast messages</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium text-gray-500">Address this message to (120 clients selected)</div>
          <div className="inline-flex justify-start gap-4 self-stretch">
            <SelectField data={typesSelectOptions} form={form} name="type" placeholder="Comercial/Residential" />
            <SelectField data={paymentType} form={form} name="Citys" placeholder="City" />
          </div>

          <div className="inline-flex w-full justify-start gap-4 self-stretch">
            <div className="w-full">
              <InputField
                className="h-44"
                form={form}
                placeholder="Type client notes here..."
                label="Message"
                name="clientNotes"
                type="textArea"
              />
            </div>
            <div className="w-full pt-3">
              <div className="w-full pt-3">
                <DatePickerField label="When send this message?" form={form} name="startOn" placeholder="Send on" />
              </div>
              <div className="w-full pt-3">
                <TimeField aria-label="Select time" value={timeValue} onChange={handleTimeChange} />
              </div>
            </div>
          </div>
          <Button className="w-full" type="submit">
            Schedule broadcast
          </Button>
        </div>
      </form>
    </Form>
  );
}
