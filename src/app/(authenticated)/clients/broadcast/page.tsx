'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { MultiSelect } from '@/components/MultiSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { clientAxios } from '@/lib/clientAxios';
import { FieldType } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';

type FormData = {
  contacts: { name: string; email: string }[];
  message: string;
};

const schema = z.object({
  contacts: z.array(z.object({ name: z.string(), email: z.string() })),
  message: z.string().min(1, { message: 'Message is required' })
});

export default function Page() {
  const { data: clientsData = [] } = useGetClients();
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
  const [selectedClients, setSelectedClients] = React.useState<Client[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      contacts: [],
      message: ''
    }
  });

  const cities = ['All cities', ...Array.from(new Set(clientsData?.map((client: Client) => client.city) ?? []))];
  const citysSelectOptions = cities.map((city) => ({ value: city, name: city, label: city, key: city }));

  const handleSubmit = async (formData: FormData) => {
    try {
      const contacts = selectedClients.map((client) => ({
        name: client.fullName,
        email: client.email
      }));

      if (contacts.length === 0) {
        toast({
          variant: 'error',
          title: 'No clients selected',
          description: 'Please, check the cities selected',
          duration: 5000
        });
        return;
      }

      const formDataToSend = {
        message: formData.message,
        contacts
      };

      // Enviar os dados para a API
      const response = await clientAxios.post('/clients/broadcast', formDataToSend);

      if (response.status !== 200) {
        throw new Error('Failed to send email');
      }

      // Toast de sucesso
      toast({
        duration: 2000,
        variant: 'success',
        title: 'Email sent successfully'
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: 'error',
        title: 'Error sending email',
        description: error?.data?.response?.message ? error.data.response.message : 'Internal server error',
        duration: 5000
      });
    }
  };

  const handleCitySelectionChange = (selected: string[]) => {
    setSelectedCities(selected);
    const filteredClients = selected.includes('All cities')
      ? clientsData
      : clientsData.filter((client: Client) => selected.includes(client.city));
    setSelectedClients(filteredClients);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="text-black-500 text-xl font-semibold">Broadcast messages</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="text-md h-5 font-medium text-gray-500">
            Address this message to <b>{selectedClients.length} clients </b>.
          </div>
          <div className="inline-flex justify-start gap-4 self-stretch">
            <MultiSelect
              placeholder="Select Cities"
              options={citysSelectOptions}
              selected={selectedCities}
              onChange={(text: string[]) => handleCitySelectionChange(text)}
            />
          </div>
          <div className="inline-flex w-full justify-start gap-4 self-stretch">
            <div className="w-full">
              <InputField
                className="h-44"
                placeholder="Type client notes here..."
                label="Message"
                name="message"
                type={FieldType.TextArea}
              />
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
