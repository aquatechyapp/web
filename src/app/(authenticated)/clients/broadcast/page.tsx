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

const schema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
  subject: z.string().min(1, { message: 'Subject is required' })
});

export default function Page() {
  const { data: clientsData = [] } = useGetClients();
  const [selectedCities, setSelectedCities] = useState<string[]>(['All cities']);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['All types']);
  const [selectedDays, setSelectedDays] = useState<string[]>(['All days']);
  const [filteredClients, setFilteredClients] = useState(clientsData);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      message: '',
      subject: ''
    }
  });

  const cities = ['All cities', ...new Set(clientsData.map((client) => client.city))];
  const types = ['All types', ...new Set(clientsData.map((client) => client.type))];
  const daysOfWeek = [
    'All days',
    ...new Set(
      clientsData.flatMap((client) =>
        client.pools.flatMap((pool) => pool.assignments.map((assignment) => assignment.weekday))
      )
    )
  ];

  const applyFilters = () => {
    const isAllSelected = (selected: string[], allValue: string) =>
      selected.includes(allValue) || selected.length === 0;

    const filtered = clientsData.filter((client) => {
      const cityMatch = isAllSelected(selectedCities, 'All cities') || selectedCities.includes(client.city);
      const typeMatch = isAllSelected(selectedTypes, 'All types') || selectedTypes.includes(client.type);
      const dayMatch =
        isAllSelected(selectedDays, 'All days') ||
        client.pools.some((pool) => pool.assignments.some((assignment) => selectedDays.includes(assignment.weekday)));

      return cityMatch && typeMatch && dayMatch;
    });

    setFilteredClients(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCities, selectedTypes, selectedDays]);

  const handleCitySelectionChange = (selected: string[]) => {
    setSelectedCities(selected.includes('All cities') ? ['All cities'] : selected);
  };

  const handleTypeSelectionChange = (selected: string[]) => {
    if (selected.includes('All types')) {
      // Se "All types" for selecionado, apenas defina isso como valor
      setSelectedTypes(['All types']);
    } else {
      // Caso contrário, defina os tipos selecionados
      setSelectedTypes(selected);
    }
  };

  const handleDaySelectionChange = (selected: string[]) => {
    setSelectedDays(selected.includes('All days') ? ['All days'] : selected);
  };

  const handleSubmit = (formData: { message: string; subject: string }) => {
    if (filteredClients.length === 0) {
      toast({
        variant: 'error',
        title: 'No clients selected',
        description: 'Please refine your filters to select at least one client.',
        duration: 5000
      });
      return;
    }

    // Lógica para envio do formulário
    console.log('Form data:', {
      ...formData,
      recipients: filteredClients.map((client) => ({ name: client.fullName, email: client.email }))
    });

    toast({
      variant: 'success',
      title: 'Message sent successfully!'
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-2">
          <div>
            <p>
              Address this message to <b>{filteredClients.length} clients</b>.
            </p>
          </div>

          <div className="inline-flex justify-start gap-4 self-stretch">
            <MultiSelect
              placeholder="Select Cities"
              options={cities.map((city) => ({ value: city, label: city }))}
              selected={selectedCities}
              onChange={handleCitySelectionChange}
            />
            <MultiSelect
              placeholder="Select Days"
              options={daysOfWeek.map((day) => ({ value: day, label: day }))}
              selected={selectedDays}
              onChange={handleDaySelectionChange}
            />
            <div className="mt-2 w-full">
              <SelectField
                name="type"
                placeholder="Select Types"
                options={types.map((type) => ({
                  key: type, // Uma chave única para cada item
                  value: type, // O valor que será enviado ao formulário
                  name: type === 'All types' ? 'All types' : type // Nome que será mostrado para o usuário
                }))}
                onValueChange={handleTypeSelectionChange}
              />
            </div>
          </div>

          <Input placeholder="Enter subject" {...form.register('subject')} />
          <div className="w-full">
            <InputField placeholder="Insert a message for your clients" name="message" type={FieldType.TextArea} />
          </div>

          <ModalSend disabled={!form.watch('message')} onSubmit={() => form.handleSubmit(handleSubmit)()} />
        </div>
      </form>
    </Form>
  );
}
