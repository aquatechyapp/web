'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import DatePickerField from '@/components/DatePickerField';
import InputField from '@/components/InputField';
import { MultiSelect } from '@/components/MultiSelect';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { clientAxios } from '@/lib/clientAxios';

export default function Page() {
  const { data: clientsData } = useGetClients();
  const [selectedCities, setSelectedCities] = React.useState([]);
  const [selected, setSelect] = React.useState([]);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      emailType: 'broadcast',
      message: '',
      type: 'All types',
      sendAt: '',
      contacts: [] // Inicializa os contatos como um array vazio
    }
  });

  const types = ['All types', ...Array.from(new Set(clientsData?.map((client) => client.type) ?? []))];
  const typesSelectOptions = types.map((type) => ({ value: type, name: type }));

  const cities = ['All cities', ...Array.from(new Set(clientsData?.map((client) => client.city) ?? []))];
  const citysSelectOptions = cities.map((city) => ({ value: city, name: city, label: city }));

  const handleSubmit = async (formData) => {
    try {
      // Filtrar os clientes com base no tipo selecionado
      const filteredClientsTypes =
        formData.type === 'All types' ? clientsData : clientsData.filter((client) => client.type === formData.type);

      // Filtrar os clientes com base nas cidades selecionadas
      const filteredClientsCitys = selectedCities.includes('All cities')
        ? filteredClientsTypes
        : filteredClientsTypes.filter((client) => selectedCities.includes(client.city));

      setSelect(filteredClientsCitys.length);

      // Atualizar os contatos do formulário com os clientes filtrados
      const contacts = filteredClientsCitys.map((client) => ({
        name: client.name,
        email: client.email1
      }));

      // Combine os dados do formulário com os dados dos clientes selecionados e formate a data corretamente
      const localDateTime = new Date(`${formData.startOn.toISOString().split('T')[0]}T${formData.time}:00`);
      const sendAt = localDateTime.toISOString();

      const formDataToSend = {
        emailType: formData.emailType,
        message: formData.message,
        sendAt: sendAt,
        contacts: contacts.length > 0 ? contacts : []
      };

      console.log('formDataToSend', formDataToSend);

      // Enviar os dados para a API
      const response = await clientAxios.post('/sendemail', formDataToSend);

      if (response.status !== 200) {
        throw new Error('Failed to send email');
      }

      // Toast de sucesso
      toast({
        variant: 'default',
        title: 'Email successfully sent',
        className: 'bg-green-500 text-white'
      });
    } catch (error: any) {
      console.error('Error sending email:', error.message);
      // Toast de erro
      toast({
        variant: 'destructive',
        title: 'Error sending the e-mail',
        className: 'bg-red-500 text-white'
      });
    }
  };

  const handleCitySelectionChange = (selected) => {
    setSelectedCities(selected);
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => ({
    value: `${i.toString().padStart(2, '0')}:00`,
    name: `${i.toString().padStart(2, '0')}:00`
  }));

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
              options={citysSelectOptions}
              selected={selectedCities}
              onChange={(text) => handleCitySelectionChange(text)}
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
                <SelectField label="Select time" data={timeOptions} form={form} name="time" placeholder="Select time" />
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
