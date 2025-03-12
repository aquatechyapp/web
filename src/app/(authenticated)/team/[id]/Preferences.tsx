'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { useUpdateCompanyPreferences } from '@/hooks/react-query/companies/updatePreferences';
import { Company } from '@/ts/interfaces/Company';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useUpdateEquipmentMaintenancePreferences } from '@/hooks/react-query/companies/updateEquipmentMaintenancePreferences';

const schema = z.object({
  sendEmails: z.boolean(),
  attachChemicalsReadings: z.boolean(),
  attachChecklist: z.boolean(),
  attachServicePhotos: z.boolean(),
  ccEmail: z.string(),
  filterCleaningIntervalDays: z.coerce.number().min(1)
});

export default function Page({ company }: { company: Company }) {
  const { isPending: isEmailPending, mutate: updateEmailPrefs } = useUpdateCompanyPreferences(company.id);
  const { isFreePlan } = useUserStore(
    useShallow((state) => ({
      isFreePlan: state.isFreePlan
    }))
  );

  const user = useUserStore((state) => state.user);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      sendEmails: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.sendEmails || false,
      attachChemicalsReadings: isFreePlan
        ? false
        : company.preferences?.serviceEmailPreferences?.attachChemicalsReadings || false,
      attachChecklist: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachChecklist || false,
      attachServicePhotos: isFreePlan
        ? false
        : company.preferences?.serviceEmailPreferences?.attachServicePhotos || false,
      ccEmail: isFreePlan ? '' : company.preferences?.serviceEmailPreferences?.ccEmail || '',
      filterCleaningIntervalDays: company.preferences?.equipmentMaintenancePreferences?.filterCleaningIntervalDays || 28
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

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const subscription = form.watch(() => form.trigger());
    return () => subscription.unsubscribe();
  }, [form]);

  const filterDays = form.watch('filterCleaningIntervalDays');
  const [initialFilterDays] = useState(filterDays);

  const handleSubmit = (data: z.infer<typeof schema>) => {
    const { filterCleaningIntervalDays, ...emailPrefs } = data;

    // Combine all preferences into a single request
    const updateData = {
      serviceEmailPreferences: {
        ...emailPrefs
      },
      equipmentMaintenancePreferences: {
        filterCleaningIntervalDays
      },
      companyId: company.id
    };

    // Use only updateEmailPrefs since it points to the correct endpoint
    updateEmailPrefs(updateData);
  };

  if (isEmailPending) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form className="w-full flex-col items-center" onSubmit={form.handleSubmit(handleSubmit)}>
        <div
          className={cn('flex w-full flex-col gap-2 divide-y border-gray-200 [&>:nth-child(3)]:pt-2', {
            'opacity-50': isFreePlan
          })}
        >
          {fields.map((field) => (
            <div key={field.label} className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
              {/* <div className='flex gap-2'> */}
              <div className="col-span-8 row-auto flex flex-col">
                <label htmlFor={field.label} className="flex flex-col space-y-1">
                  <span className="text-sm font-semibold text-gray-800">{field.label}</span>
                </label>
                <span className="text-muted-foreground text-sm font-normal">{field.description}</span>
              </div>
              {/* </div> */}
              <div className="col-span-4 flex flex-col gap-2">
                {field.itens.map((item) => {
                  const isFieldSendEmails = item.name === 'sendEmails';

                  return (
                    <div className="flex w-full items-center gap-4">
                      <div className={field.type === FieldType.Default ? 'w-full' : ''}>
                        <InputField
                          disabled={!isFreePlan ? (isFieldSendEmails ? false : sendEmails ? false : true) : true}
                          key={item.name}
                          name={item.name}
                          type={item.type || field.type}
                          placeholder={field.type === FieldType.Default ? item.label : ''}
                        />
                      </div>
                      {field.type === FieldType.Switch && (
                        <label htmlFor={item.label}>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                          </div>
                          {item.subLabel ? (
                            <div>
                              <span className="text-sm font-normal text-gray-800">{item.subLabel}</span>
                            </div>
                          ) : null}
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <Button disabled={!form.formState.isDirty || isFreePlan || isEmailPending} className="mt-2">
            {isEmailPending ? (
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">Enable Email Notifications</DialogTitle>

            <DialogDescription className="mt-4 text-left">
              This action will change the email notifications for all clients under this company. If you want specific
              clients not to receive or receive emails, you'll need to change it manually in their individual settings
              on the clients page.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateEmailPrefs(formData);
                setShowConfirmModal(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
    type?: FieldType;
  }[];
}[];

const fields: Fields = [
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Send e-mails when a service is done.',
    label: 'Send e-mails',
    itens: [
      {
        label: 'Send e-mails',
        subLabel: '(only on grow plan)',
        description: 'Send e-mails when a service is done.',
        name: 'sendEmails'
      }
    ]
  },
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Select the information you want to send in the e-mails.',
    label: 'Include in e-mails',
    itens: [
      {
        label: 'Chemicals Readings',
        description: 'Send e-mails with chemicals readings.',
        name: 'attachChemicalsReadings'
      },
      {
        label: 'Checklist',
        description: 'Send e-mails with checklist.',
        name: 'attachChecklist'
      },
      {
        label: 'Service Photos',
        description: 'Send e-mails with service photos.',
        name: 'attachServicePhotos'
      }
    ]
  },
  {
    description: 'Send a copy to another e-mail.',
    itens: [
      {
        label: 'Cc E-mail',
        description: 'E-mail to send a copy to.',
        name: 'ccEmail'
      }
    ],
    label: 'Cc E-mail',
    type: FieldType.Default
  },
  {
    description: 'Set the interval in days for filter cleaning maintenance.',
    itens: [
      {
        label: 'days',
        description: 'Number of days between filter cleanings',
        name: 'filterCleaningIntervalDays',
        type: FieldType.Number
      }
    ],
    label: 'Filter Cleaning Interval',
    type: FieldType.Default
  }
];
