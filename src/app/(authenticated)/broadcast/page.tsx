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
  const [timeValue, setTimeValue] = useState(null);

  const form = useForm({
    defaultValues: {
      Citys: '',
      type: '',
      contacts: [] // Inicializa os contatos como um array vazio
    }
  });

  const types = Array.from(new Set(clientsData?.map((client) => client.type) ?? []));
  const typesSelectOptions = types.map((type) => ({ value: type, name: type }));

  // const commercialClients = clientsData.filter((client) => client.type === 'Commercial');

  // // Criar lista de objetos {name, email} dos clientes comerciais
  // const commercialContacts = commercialClients.map((client) => ({
  //   name: client.name,
  //   email: client.email1
  // }));

  // console.log('Lista de contatos dos clientes comerciais:', commercialContacts);

  const handleTimeChange = (newValue) => {
    setTimeValue(newValue); // Atualiza o estado com o novo valor do campo de tempo
  };

  const handleSubmit = (formData) => {
    const filteredClients = clientsData.filter((client) => client.type === formData.type);

    // Atualizar os contatos do formulário com os clientes filtrados
    const commercialContacts = filteredClients.map((client) => ({
      name: client.name,
      email: client.email1
    }));

    // Adicione o valor do campo de tempo aos dados do formulário
    const formDataWithTime = { ...formData, hours: timeValue };

    // Obtenha os contatos do formData
    const contacts = formData.contacts || [];

    // Combine os dados do formulário com os dados dos clientes selecionados
    const formDataToSend = {
      ...formDataWithTime,
      // Use os contatos existentes se houver, caso contrário, use os selecionados
      contacts: contacts.length > 0 ? contacts : commercialContacts.map(({ name, email }) => ({ name, email }))
    };

    console.log('Dados do formulário:', formDataToSend);
    // Agora você pode enviar formDataToSend para a API
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
