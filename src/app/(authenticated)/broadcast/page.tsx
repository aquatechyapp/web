'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form } from '@/components/ui/form';
import { paymentType } from '@/constants';
import useGetClients from '@/hooks/react-query/clients/getClients';

export default function Page() {
  const { data: clientsData } = useGetClients();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const form = useForm({
    defaultValues: {
      filter: 'all',
      type: 'all'
    }
  });

  const types = Array.from(new Set(clientsData?.map((client) => client.type) ?? []));
  const typesSelectOptions = types.map((type) => ({ value: type, name: type }));

  console.log(clientsData);

  const handleSubmit = (formData) => {
    console.log('Dados do formulário:', formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="text-black-500 text-xl font-semibold">Broadcast messages</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium   text-gray-500">Address this message to (120 clients selected)</div>
          <div className="inline-flex justify-start gap-4 self-stretch">
            <SelectField
              data={typesSelectOptions}
              form={form}
              name="Comercial/Residential"
              placeholder="Comercial/Residential"
            />
            <SelectField data={paymentType} form={form} name="City" placeholder="City" />
          </div>

          <div className="inline-flex w-full justify-start gap-4 self-stretch">
            <div className="w-[50%] w-full">
              <InputField
                form={form}
                placeholder="Type client notes here..."
                label="Message"
                name="clientNotes"
                type="textArea"
              />
            </div>
            <div className="w-full">
              <div className="text-black-500 pt-1 text-sm font-medium">When send this message?</div>
              <Calendar mode="single" selected={date} onSelect={setDate} className="mt-2 w-full rounded-md border" />
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
