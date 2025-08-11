'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect';
import { FieldType } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';
import { useUpdateClientPreferences } from '@/hooks/react-query/clients/updatePreferences';

const schema = z.object({
  sendEmails: z.boolean(),
  attachChemicalsReadings: z.boolean(),
  attachChecklist: z.boolean(),
  attachServicePhotos: z.boolean(),
  sendFilterCleaningEmails: z.boolean()
});

export default function EmailPreferences({ client }: { client: Client }) {
  const { isPending, mutate } = useUpdateClientPreferences(client.id);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sendEmails: client.preferences?.serviceEmailPreferences?.sendEmails || false,
      attachChemicalsReadings: client.preferences?.serviceEmailPreferences?.attachChemicalsReadings || false,
      attachChecklist: client.preferences?.serviceEmailPreferences?.attachChecklist || false,
      attachServicePhotos: client.preferences?.serviceEmailPreferences?.attachServicePhotos || false,
      sendFilterCleaningEmails: client.preferences?.serviceEmailPreferences?.sendFilterCleaningEmails || false
    }
  });

  const { sendEmails } = form.getValues();
  useDidUpdateEffect(handleEmailsChange, [sendEmails]);

  function handleEmailsChange() {
    if (sendEmails) {
      form.setValue('attachChemicalsReadings', true);
      form.setValue('attachChecklist', true);
      form.setValue('attachServicePhotos', true);
    } else {
      form.setValue('attachChemicalsReadings', false);
      form.setValue('attachChecklist', false);
      form.setValue('attachServicePhotos', false);
    }
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form className="w-full flex-col items-center" onSubmit={form.handleSubmit((data) => mutate(data))}>
        <div className="flex w-full flex-col gap-2 divide-y border-gray-200 [&>:nth-child(3)]:pt-2">
          {fields.map((field) => (
            <div key={field.label} className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
              <div className="col-span-8 row-auto flex flex-col">
                <label htmlFor={field.label} className="flex flex-col space-y-1">
                  <span className="text-sm font-semibold text-gray-800">{field.label}</span>
                </label>
                <span className="text-muted-foreground text-sm font-normal">{field.description}</span>
              </div>
              <div className="col-span-4 flex flex-col gap-2">
                {field.itens.map((item) => {
                  const isFieldSendEmails = item.name === 'sendEmails';

                  return (
                    <div key={item.name} className="flex w-full items-center gap-4">
                      <div className={field.type === FieldType.Default ? 'w-full' : ''}>
                        <InputField
                          disabled={isFieldSendEmails ? false : item.name === 'sendFilterCleaningEmails' ? false : sendEmails ? false : true}
                          key={item.name}
                          name={item.name}
                          type={field.type}
                          placeholder={field.type === FieldType.Default ? item.label : ''}
                        />
                      </div>
                      {field.type === FieldType.Switch && (
                        <label htmlFor={item.label}>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                          </div>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <Button disabled={!form.formState.isDirty} className="mt-2">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

type Fields = {
  inputClassName?: string;
  type: FieldType;
  description: string;
  label: string;
  itens: {
    label: string;
    description: string;
    name: string;
  }[];
}[];

const fields: Fields = [
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Send e-mails when a service is done.',
    label: 'Send service e-mails',
    itens: [
      {
        label: 'Send service e-mails',
        description: 'Send e-mails when a service is done.',
        name: 'sendEmails'
      }
    ]
  },
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Select the information you want to send in the service e-mails.',
    label: 'Include in service e-mails',
    itens: [
      {
        label: 'Chemicals Readings',
        description: 'Send service e-mails with chemicals readings.',
        name: 'attachChemicalsReadings'
      },
      {
        label: 'Checklist',
        description: 'Send service e-mails with checklist.',
        name: 'attachChecklist'
      },
      {
        label: 'Service Photos',
        description: 'Send service e-mails with service photos.',
        name: 'attachServicePhotos'
      }
    ]
  },
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Send e-mails when filter cleaning is completed.',
    label: 'Filter cleaning notifications',
    itens: [
      {
        label: 'Send filter cleaning e-mails',
        description: 'Send e-mails when filter cleaning is completed.',
        name: 'sendFilterCleaningEmails'
      }
    ]
  }
];
