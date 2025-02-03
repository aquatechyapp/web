'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { MultiSelect } from '@/components/MultiSelect';
import SelectField from '@/components/SelectField';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { FieldType } from '@/ts/enums/enums';

import { ModalSend } from './ModalSend';
import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { AxiosError } from 'axios';
import { error } from 'console';

const schema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
  subject: z.string().min(1, { message: 'Subject is required' })
});

type SendBroadcastInput = {
  contacts: {
    name: string;
    email: string;
  }[];
  message: string;
  subject: string;
};

async function sendBroadcastFn(data: SendBroadcastInput) {
  const response = await clientAxios.post('/clients/broadcast', data);
  return response.data;
}

const useSendBroadcastService = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: sendBroadcastFn,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Broadcast scheduled',
        description: 'Your broadcast has been successfully scheduled for your clients.'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        variant: 'error',
        title: 'Error sending broadcast',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
};

export default function Page() {
  const { data: clientsData = [] } = useGetClients();
  const [selectedCities, setSelectedCities] = useState<string[]>(['All cities']);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['All clients']);
  const [selectedDays, setSelectedDays] = useState<string[]>(['All days']);
  const [filteredClients, setFilteredClients] = useState(clientsData);
  const { toast } = useToast();

  const sendBroadcasService = useSendBroadcastService();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      message: '',
      subject: ''
    }
  });

  const cities = ['All cities', ...Array.from(new Set(clientsData.map((client) => client.city)))];
  const types = ['All clients', 'Residential', 'Commercial'];
  const daysOfWeek = [
    'All days',
    ...Array.from(
      new Set(
        clientsData.flatMap((client) =>
          client.pools.flatMap((pool) => pool.assignments?.map((assignment) => assignment.weekday))
        )
      )
    )
  ];

  const applyFilters = () => {
    const isAllSelected = (selected: string[], allValue: string) =>
      selected.includes(allValue) || selected.length === 0;

    const filtered = clientsData.filter((client) => {
      const cityMatch = isAllSelected(selectedCities, 'All cities') || selectedCities.includes(client.city);
      const typeMatch = isAllSelected(selectedTypes, 'All clients') || selectedTypes.includes(client.type);
      const dayMatch =
        isAllSelected(selectedDays, 'All days') ||
        client.pools.some((pool) => pool.assignments?.some((assignment) => selectedDays.includes(assignment.weekday)));

      return cityMatch && typeMatch && dayMatch;
    });

    setFilteredClients(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCities, selectedTypes, selectedDays]);

  const handleCitySelectionChange = (selected: string[]) => {
    if (selected.includes('All cities') && !selectedCities.includes('All cities')) {
      setSelectedCities(['All cities']);
    } else {
      setSelectedCities(selected.filter((city) => city !== 'All cities'));
    }
  };

  const handleTypeSelectionChange = (selected: string[]) => {
    if (selected.includes('All clients')) {
      // Se "All" for selecionado, apenas defina isso como valor
      setSelectedTypes(['All clients']);
    } else {
      // Caso contrário, defina os tipos selecionados
      setSelectedTypes(selected);
    }
  };

  const handleDaySelectionChange = (selected: string[]) => {
    if (selected.includes('All days') && !selectedDays.includes('All days')) {
      setSelectedDays(['All days']);
    } else {
      setSelectedDays(selected.filter((city) => city !== 'All days'));
    }
  };

  const handleSubmit = async (formData: { message: string; subject: string }) => {
    if (filteredClients.length === 0) {
      toast({
        variant: 'error',
        title: 'No clients selected',
        description: 'Please refine your filters to select at least one client.',
        duration: 5000
      });
      return;
    }

    try {
      await sendBroadcasService.mutateAsync({
        ...formData,
        contacts: filteredClients.map((client) => ({ name: client.fullName, email: client.email }))
      });
      setSelectedCities(['All cities']);
      setSelectedDays(['All days']);
      setSelectedTypes(['All clients']);
      form.reset({ subject: '', message: '' });
    } catch (error) {
      return;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-2">
          <div>
            <p>
              Address this message to <b>{filteredClients.length} clients</b>.
            </p>
          </div>

          <div className="mb-5 flex w-full flex-col gap-1 md:flex-row md:gap-4">
            <MultiSelect
              placeholder="Select Cities"
              options={cities.map((city) => ({ value: city, label: city }))}
              selected={selectedCities}
              onChange={handleCitySelectionChange}
            />
            <MultiSelect
              placeholder="Select Days"
              options={daysOfWeek.map((day) => ({ value: day, label: day })) as any}
              selected={selectedDays}
              onChange={handleDaySelectionChange}
            />
            <div className="mt-2 w-full">
              <SelectField
                name="type"
                placeholder="Select client types"
                value={selectedTypes[0] || 'All clients'}
                options={types.map((type) => ({
                  key: type, // Uma chave única para cada item
                  value: type, // O valor que será enviado ao formulário
                  name: type === 'All clients' ? 'All clients' : type // Nome que será mostrado para o usuário
                }))}
                onValueChange={handleTypeSelectionChange as any}
              />
            </div>
          </div>

          <Input placeholder="Enter subject" {...form.register('subject')} />
          <div className="w-full">
            <InputField placeholder="Insert a message for your clients" name="message" type={FieldType.TextArea} />
          </div>
          <ConfirmActionDialog
            trigger={
              <Button
                className="w-full"
                disabled={
                  form.watch('subject').length < 3 || form.watch('message').length < 3 || filteredClients.length === 0
                }
              >
                <SendIcon className="mr-2 h-4 w-4" />
                Schedule broadcast
              </Button>
            }
            title="Do you want to confirm shipping?"
            description="You are about to send an email to your selected customers"
            onConfirm={form.handleSubmit(handleSubmit)}
          />
        </div>
      </form>
    </Form>
  );
}
