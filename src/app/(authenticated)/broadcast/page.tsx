'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import DatePickerField from '@/components/DatePickerField';
import InputField from '@/components/InputField';
import { MultiSelect } from '@/components/MultiSelect';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TimeField } from '@/components/ui/time-field';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { clientAxios } from '@/lib/clientAxios';

export default function Page() {
  const { data: clientsData } = useGetClients();
  const [timeValue, setTimeValue] = useState(null);
  const [selectedCities, setSelectedCities] = useState(['all']);
  const [selected, setSelected] = useState(0);

  const form = useForm({
    defaultValues: {
      emailType: 'broadcast',
      message: '',
      type: 'all', // Inicializa como 'all' para 'All types'
      contacts: [] // Inicializa os contatos como um array vazio
    }
  });

  const types = Array.from(new Set(clientsData?.map((client) => client.type) ?? []));
  const typesSelectOptions = [
    { value: 'all', name: 'All types' },
    ...types.map((type) => ({ value: type, name: type }))
  ];

  const cities = Array.from(new Set(clientsData?.map((client) => client.city) ?? []));
  const citiesSelectOptions = [
    { value: 'all', name: 'All cities', label: 'All cities' },
    ...cities.map((city) => ({ value: city, name: city, label: city }))
  ];

  const handleTimeChange = (newValue) => {
    setTimeValue(newValue);
  };

  const handleSubmit = async (formData) => {
    try {
      // Filtrar os clientes com base no tipo selecionado
      let filteredClientsTypes = clientsData;
      if (formData.type !== 'all') {
        filteredClientsTypes = clientsData.filter((client) => client.type === formData.type);
      }

      // Filtrar os clientes com base nas cidades selecionadas
      let filteredClientsCities = filteredClientsTypes;
      if (!selectedCities.includes('all')) {
        filteredClientsCities = filteredClientsTypes.filter((client) => selectedCities.includes(client.city));
      }

      setSelected(filteredClientsCities.length);

      // Atualizar os contatos do formulário com os clientes filtrados
      const contacts = filteredClientsCities.map((client) => ({
        name: client.name,
        email: client.email1
      }));

      // Adicione o valor do campo de tempo aos dados do formulário
      const formDataWithTime = { ...formData, hours: timeValue };

      // Combine os dados do formulário com os dados dos clientes selecionados
      const formDataToSend = {
        ...formDataWithTime,
        // Use os contatos existentes se houver, caso contrário, use os selecionados
        contacts: contacts.length > 0 ? contacts : []
      };

      // Enviar os dados para a API
      const response = await clientAxios.post('/sendemail', formDataToSend);

      if (response.status !== 200) {
        throw new Error('Failed to send email');
      }
      console.log('formDataToSend', formDataToSend);

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  };

  const handleCitySelectionChange = (selected) => {
    // Se "All cities" for selecionado, ignorar outras seleções
    if (selected.includes('all')) {
      setSelectedCities(['all']);
    } else {
      setSelectedCities(selected);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="text-black-500 text-xl font-semibold">Broadcast messages</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium text-gray-500">
            Address this message to ({selected} clients selected)
          </div>
          <div className="inline-flex justify-start gap-4 self-stretch">
            <SelectField data={typesSelectOptions} form={form} name="type" placeholder="Commercial/Residential" />
            <MultiSelect
              placeholder="Cities"
              options={citiesSelectOptions}
              selected={selectedCities}
              onChange={handleCitySelectionChange}
            />
          </div>

          <div className="inline-flex w-full justify-start gap-4 self-stretch">
            <div className="w-full">
              <InputField
                className="h-44"
                form={form}
                placeholder="Type client notes here..."
                label="Message"
                name="message"
                type="textArea"
              />
            </div>
            <div className="w-full pt-[10px]">
              <div className="w-full">
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
