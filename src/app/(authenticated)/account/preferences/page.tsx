'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useChangeUserPreferences } from '@/hooks/react-query/user/changeUserPreferences';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';

const schema = z.object({
  sendEmails: z.boolean(),
  attachChemicalsReadings: z.boolean(),
  attachChecklist: z.boolean(),
  attachServiceNotes: z.boolean(),
  attachServicePhotos: z.boolean(),
  ccEmail: z.string()
});

export default function Page() {
  const { isPending, mutate } = useChangeUserPreferences();
  const { userPreferences, isFreePlan } = useUserStore(
    useShallow((state) => ({
      userPreferences: state.user?.userPreferences,
      isFreePlan: state.isFreePlan
    }))
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sendEmails: isFreePlan ? false : userPreferences.serviceEmailPreferences.sendEmails || false,
      attachChemicalsReadings: isFreePlan
        ? false
        : userPreferences.serviceEmailPreferences.attachChemicalsReadings || false,
      attachChecklist: isFreePlan ? false : userPreferences.serviceEmailPreferences.attachChecklist || false,
      attachServiceNotes: isFreePlan ? false : userPreferences.serviceEmailPreferences.attachServiceNotes || false,
      attachServicePhotos: isFreePlan ? false : userPreferences.serviceEmailPreferences.attachServicePhotos || false,
      ccEmail: isFreePlan ? '' : userPreferences.serviceEmailPreferences.ccEmail || ''
    }
  });

  const { sendEmails } = form.getValues();

  useEffect(() => {
    if (sendEmails) {
      form.setValue('attachChemicalsReadings', true);
      form.setValue('attachChecklist', true);
      form.setValue('attachServiceNotes', true);
      form.setValue('attachServicePhotos', true);
    } else {
      form.setValue('attachChemicalsReadings', false);
      form.setValue('attachChecklist', false);
      form.setValue('attachServiceNotes', false);
      form.setValue('attachServicePhotos', false);
    }
  }, [sendEmails]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form className="w-full flex-col items-center" onSubmit={form.handleSubmit((data) => mutate(data))}>
        <h1 className="text-2xl font-bold">E-mail Preferences</h1>
        <h2 className="text-gray-500">Manage your notifications settings.</h2>
        <div className="mt-4 flex w-full flex-col divide-y rounded-md border border-gray-200 pt-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className="grid w-full grid-cols-1 items-center space-x-2 space-y-1 px-4 py-4 md:grid-cols-12"
            >
              <div className="col-span-8 row-auto flex flex-col">
                <label className="flex-1 text-nowrap font-semibold" htmlFor={field.label}>
                  {field.label}
                </label>
                <span className="text-gray-500">{field.description}</span>
              </div>
              <div className="col-span-4 w-full">
                {field.itens.map((item) => {
                  const isFieldSendEmails = item.name === 'sendEmails';

                  return (
                    <div className="flex w-full items-center gap-4">
                      <div className={field.type === FieldType.Default ? 'w-full' : ''}>
                        <InputField
                          disabled={!isFreePlan ? (isFieldSendEmails ? false : sendEmails ? false : true) : true}
                          key={item.name}
                          name={item.name}
                          type={field.type}
                          placeholder={field.type === FieldType.Default ? item.label : ''}
                        />
                      </div>
                      {field.type === FieldType.Switch && (
                        <label className="mt-1 text-nowrap font-semibold text-gray-700" htmlFor={item.label}>
                          {item.label}
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <Button className="mt-2">Save</Button>
        </div>
      </form>
    </Form>
  );
}

const fields = [
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Receive e-mails when a service was done.',
    label: 'Send Emails',
    itens: [
      {
        label: 'Send E-mails',
        description: 'Receive e-mails when a service was done.',
        name: 'sendEmails'
      }
    ]
  },
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Kawan crie uma descricao',
    label: 'Include in e-mails',
    itens: [
      {
        label: 'Chemicals Readings',
        description: 'Receive e-mails when a service was done.',
        name: 'attachChemicalsReadings'
      },
      {
        label: 'Checklist',
        description: 'Receive e-mails when a service was done.',
        name: 'attachChecklist'
      },
      {
        label: 'Service Notes',
        description: 'Receive e-mails when a service was done.',
        name: 'attachServiceNotes'
      },
      {
        label: 'Service Photos',
        description: 'Receive e-mails when a service was done.',
        name: 'attachServicePhotos'
      }
    ]
  },
  {
    description: 'Send a copy to another e-mail',
    itens: [
      {
        label: 'Cc E-mail',
        description: 'Company email to include in copy.',
        name: 'ccEmail'
      }
    ],
    label: 'Cc E-mail',
    type: FieldType.Default
  }
];
