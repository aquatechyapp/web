'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { MultiSelect } from '@/components/MultiSelect';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { clientAxios } from '@/lib/clientAxios';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';

import { ModalSend } from './ModalSend';

type FormData = {
  contacts: { name: string; email: string }[];
  message: string;
  subject: string;
};

const schema = z.object({
  contacts: z.array(z.object({ name: z.string(), email: z.string() })),
  message: z.string().min(1, { message: 'Message is required' }),
  subject: z.string().min(1, { subject: 'subject is required' })
});

export default function Page() {
  const { data: clientsData = [] } = useGetClients();
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
  const [selectedClients, setSelectedClients] = React.useState<Client[]>([]);
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null); // Referência ao formulário principal

  console.log('clientsData', clientsData);

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      contacts: [],
      message: '',
      subject: ''
    }
  });

  const cities = ['All cities', ...Array.from(new Set(clientsData?.map((client: Client) => client.city) ?? []))];
  const citysSelectOptions = cities.map((city) => ({ value: city, name: city, label: city, key: city }));

  const types = ['All types', ...Array.from(new Set(clientsData?.map((client: Client) => client.type) ?? []))];
  const typesSelectOptions = types.map((type) => ({ value: type, name: type, label: type, key: type }));

  const daysOfWeek = [
    'All days',
    ...Array.from(
      new Set(
        clientsData?.flatMap((client: Client) =>
          client.pools.flatMap((pool) => pool.assignments.map((assignment: any) => assignment.weekday))
        ) ?? []
      )
    )
  ];
  const daysSelectOptions = daysOfWeek.map((day) => ({ value: day, name: day, label: day, key: day }));

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
        subject: formData.subject,
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

    // Filtrar clientes pela cidade
    const filteredClients = selected.includes('All cities')
      ? clientsData
      : clientsData.filter((client: Client) => selected.includes(client.city));

    // Atualizar clientes selecionados mantendo o filtro de tipos
    setSelectedClients((prevSelectedClients) => {
      const currentTypes = prevSelectedClients.map((client) => client.type);
      return filteredClients.filter((client) => selectedClients.length === 0 || currentTypes.includes(client.type));
    });
  };

  const handleTypeSelectionChange = (selected: string[]) => {
    const selectedTypes = selected.includes('All types') ? types : selected;

    // Filtrar clientes pelos tipos selecionados e pelas cidades previamente filtradas
    const filteredClients = selectedCities.includes('All cities')
      ? clientsData.filter((client: Client) => selectedTypes.includes(client.type))
      : clientsData.filter(
          (client: Client) => selectedCities.includes(client.city) && selectedTypes.includes(client.type)
        );

    setSelectedClients(filteredClients);
  };

  const handleDaySelectionChange = (selected: string[]) => {
    setSelectedDays(selected);

    const filteredClients = clientsData.filter((client: Client) => {
      const cityMatch = selectedCities.includes('All cities') || selectedCities.includes(client.city);
      const typeMatch = selectedTypes.includes('All types') || selectedTypes.includes(client.type);
      const dayMatch =
        selected.includes('All days') ||
        client.pools.some((pool) => pool.assignments.some((assignment: any) => selected.includes(assignment.weekday)));
      return cityMatch && typeMatch && dayMatch;
    });

    setSelectedClients(filteredClients);
  };

  const applyFilters = () => {
    const filteredClients = clientsData.filter((client: Client) => {
      const cityMatch = selectedCities.includes('All cities') || selectedCities.includes(client.city);
      const typeMatch = selectedTypes.includes('All types') || selectedTypes.includes(client.type);
      const dayMatch =
        selectedDays.includes('All days') ||
        client.pools.some((pool) =>
          pool.assignments.some((assignment: any) => selectedDays.includes(assignment.weekday))
        );
      return cityMatch && typeMatch && dayMatch;
    });
    setSelectedClients(filteredClients);
  };

  // Chame `applyFilters` após cada mudança de filtro.
  useEffect(() => {
    applyFilters();
  }, [selectedCities, selectedTypes, selectedDays]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-2">
          <div className="text-md h-5 font-medium text-gray-500">
            Address this message to <b>{selectedClients.length} clients</b>.
          </div>
          <div className="inline-flex justify-start gap-4 self-stretch">
            <MultiSelect
              placeholder="Select Cities"
              options={citysSelectOptions}
              selected={selectedCities}
              onChange={(text: string[]) => handleCitySelectionChange(text)}
            />
            <MultiSelect
              placeholder="Select Days"
              options={daysSelectOptions}
              selected={selectedDays}
              onChange={(text: string[]) => handleDaySelectionChange(text)}
            />
            <div className="mt-2 w-full">
              <SelectField
                name="type"
                options={typesSelectOptions}
                placeholder="Type"
                onValueChange={(text: string[]) => handleTypeSelectionChange(text)}
              />
            </div>
          </div>
          <div className="w-full">
            <Input placeholder="Enter a subject for your emails" name="subject" type={FieldType.TextArea} />
          </div>
          <div className="w-full">
            <InputField placeholder="Insert a message for your clients" name="message" type={FieldType.TextArea} />
          </div>
          <ModalSend
            disabled={!form.watch('message')}
            onSubmit={() => {
              formRef.current?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }}
          />
        </div>
      </form>
    </Form>
  );
}
