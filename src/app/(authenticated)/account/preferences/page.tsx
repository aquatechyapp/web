'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useChangeUserPreferences } from '@/hooks/react-query/user/changeUserPreferences';
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect';
import { cn } from '@/lib/utils';
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
  useDidUpdateEffect(handleEmailsChange, [sendEmails]);

  function handleEmailsChange() {
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
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form className="w-full flex-col items-center" onSubmit={form.handleSubmit((data) => mutate(data))}>
        <div
          className={cn('flex w-full flex-col gap-2 divide-y border-gray-200 [&>:nth-child(3)]:pt-2', {
            'opacity-50': isFreePlan
          })}
        >
          {fields.map((field) => (
            <div key={field.label} className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
              <div className="col-span-8 row-auto flex flex-col">
                <label htmlFor={field.label}>
                  <Typography element="h3" className="text-gray-description">
                    {field.label}
                  </Typography>
                </label>
                <Typography element="p" className="text-gray-description">
                  {field.description}
                </Typography>
              </div>
              <div className="col-span-4 flex w-full flex-col gap-2">
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
                        <label htmlFor={item.label}>
                          <Typography element="p">{item.label}</Typography>
                          {item.subLabel ? (
                            <Typography element="p" className="text-sm text-gray-500">
                              {item.subLabel}
                            </Typography>
                          ) : null}
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <Button disabled={!form.formState.isDirty || isFreePlan} className="mt-2">
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
    subLabel?: string;
    description: string;
    name: string;
  }[];
}[];

const fields: Fields = [
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Receive e-mails when a service was done.',
    label: 'Send Emails',
    itens: [
      {
        label: 'Send E-mails',
        subLabel: '(only on grow plan)',
        description: 'Receive e-mails when a service was done.',
        name: 'sendEmails'
      }
    ]
  },
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Select the information you want to receive in the e-mails.',
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
