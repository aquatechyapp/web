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
      startOn: '',
      time: '',
      contacts: []
    }
  });

  const types = ['All types', ...Array.from(new Set(clientsData?.map((client) => client.type) ?? []))];
  const typesSelectOptions = types.map((type) => ({ value: type, name: type }));

  const cities = ['All cities', ...Array.from(new Set(clientsData?.map((client) => client.city) ?? []))];
  const citysSelectOptions = cities.map((city) => ({ value: city, name: city, label: city }));

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 1; i <= 12; i++) {
      // times.push({ value: `${i}:00 AM`, name: `${i}:00 AM` });
      times.push({ value: `${i}:00 PM`, name: `${i}:00 PM` });
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

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

      // Validar se há mensagem
      if (!formData.message) {
        toast({
          variant: 'destructive',
          title: 'Message is required',
          className: 'bg-red-500 text-white'
        });
        return;
      }

      // Validar se há horário selecionado
      if (!formData.time) {
        toast({
          variant: 'destructive',
          title: 'Time is required',
          className: 'bg-red-500 text-white'
        });
        return;
      }

      // Validar se há contatos selecionados
      if (contacts.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No contacts selected',
          className: 'bg-red-500 text-white'
        });
        return;
      }

      // Combine os dados do formulário com os dados dos clientes selecionados e formate a data corretamente
      const [time, period] = formData.time.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      // Considerando o fuso horário do usuário
      const localDateTime = new Date(formData.startOn);
      localDateTime.setHours(hours, minutes, 0, 0);

      // Converte o horário local para UTC
      const utcDateTime = new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000);
      const sendAt = utcDateTime.toISOString();

      const formDataToSend = {
        emailType: formData.emailType,
        message: formData.message,
        sendAt: sendAt,
        contacts: contacts.length > 0 ? contacts : []
      };

      console.log('formDataToSend', formDataToSend);

      // Enviar os dados para a API
      // const response = await clientAxios.post('/sendemail', formDataToSend);

      // if (response.status !== 200) {
      //   throw new Error('Failed to send email');
      // }

      // Toast de sucesso
      toast({
        variant: 'default',
        title: 'Email sent successfully',
        className: 'bg-green-500 text-white'
      });
    } catch (error: any) {
      console.error('Error sending email:', error.message);
      // Toast de erro
      toast({
        variant: 'destructive',
        title: 'Error sending email',
        className: 'bg-red-500 text-white'
      });
    }
  };

  const handleCitySelectionChange = (selected) => {
    setSelectedCities(selected);
    const filteredClientsTypes =
      form.getValues('type') === 'All types'
        ? clientsData
        : clientsData.filter((client) => client.type === form.getValues('type'));

    const filteredClientsCitys = selected.includes('All cities')
      ? filteredClientsTypes
      : filteredClientsTypes.filter((client) => selected.includes(client.city));

    setSelect(filteredClientsCitys.length);
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
