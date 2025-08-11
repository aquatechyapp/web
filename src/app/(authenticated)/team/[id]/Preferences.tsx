'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import { Mail, Filter, Settings } from 'lucide-react';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

// Update the schema to include the new fields
const schema = z.object({
  sendEmails: z.boolean(),
  attachChemicalsReadings: z.boolean(),
  attachChecklist: z.boolean(),
  attachServicePhotos: z.boolean(),
  ccEmail: z.string(),
  filterCleaningIntervalDays: z.coerce.number().min(1),
  filterReplacementIntervalDays: z.coerce.number().min(1),
  filterCleaningMustHavePhotos: z.boolean(),
  sendFilterCleaningEmails: z.boolean()
});

export default function Page({ company }: { company: Company }) {
  const { isPending: isEmailPending, mutate: updateEmailPrefs } = useUpdateCompanyPreferences(company.id);
  const { isFreePlan } = useUserStore(
    useShallow((state) => ({
      isFreePlan: state.isFreePlan
    }))
  );

  const user = useUserStore((state) => state.user);
  const previousSendEmails = useRef<boolean | null>(null);
  const isInitialRender = useRef(true);

  // Update the form default values
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
      filterCleaningIntervalDays: company.preferences?.equipmentMaintenancePreferences?.filterCleaningIntervalDays || 28,
      filterReplacementIntervalDays: company.preferences?.equipmentMaintenancePreferences?.filterReplacementIntervalDays || 365,
      filterCleaningMustHavePhotos: company.preferences?.equipmentMaintenancePreferences?.filterCleaningMustHavePhotos || false,
      sendFilterCleaningEmails: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.sendFilterCleaningEmails || false
    }
  });

  const sendEmails = form.watch('sendEmails');

  // Use useCallback to prevent infinite re-renders
  const handleEmailsChange = useCallback((newSendEmails: boolean) => {
    if (newSendEmails) {
      form.setValue('attachChemicalsReadings', true, { shouldDirty: true });
      form.setValue('attachChecklist', true, { shouldDirty: true });
      form.setValue('attachServicePhotos', true, { shouldDirty: true });
    } else {
      form.setValue('attachChemicalsReadings', false, { shouldDirty: true });
      form.setValue('attachChecklist', false, { shouldDirty: true });
      form.setValue('attachServicePhotos', false, { shouldDirty: true });
    }
  }, [form]);

  // Only trigger handleEmailsChange when sendEmails actually changes (not on initial render)
  useEffect(() => {
    if (isInitialRender.current) {
      // On initial render, just store the current value
      previousSendEmails.current = sendEmails;
      isInitialRender.current = false;
      return;
    }

    // Only trigger if the value actually changed and it's not the initial render
    if (previousSendEmails.current !== null && previousSendEmails.current !== sendEmails) {
      handleEmailsChange(sendEmails);
      previousSendEmails.current = sendEmails;
    }
  }, [sendEmails, handleEmailsChange]);

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user, router]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const filterDays = form.watch('filterCleaningIntervalDays');
  const [initialFilterDays] = useState(filterDays);

  // Update the handleSubmit function
  const handleSubmit = (data: z.infer<typeof schema>) => {
    const { 
      filterCleaningIntervalDays, 
      filterReplacementIntervalDays, 
      filterCleaningMustHavePhotos,
      ...emailPrefs 
    } = data;

    // Combine all preferences into a single request
    const updateData = {
      serviceEmailPreferences: {
        ...emailPrefs
      },
      equipmentMaintenancePreferences: {
        filterCleaningIntervalDays: Number(filterCleaningIntervalDays),
        filterReplacementIntervalDays: Number(filterReplacementIntervalDays),
        filterCleaningMustHavePhotos
      },
      companyId: company.id
    };

    // Use only updateEmailPrefs since it points to the correct endpoint
    updateEmailPrefs(updateData);
  };

  const ccEmail = form.watch('ccEmail');

  useEffect(() => {
    const originalCcEmail = company.preferences?.serviceEmailPreferences?.ccEmail || '';
    if (ccEmail !== originalCcEmail) {
      // Force the form to recognize the change
      form.setValue('ccEmail', ccEmail, { shouldDirty: true, shouldTouch: true });
    }
  }, [ccEmail, company.preferences?.serviceEmailPreferences?.ccEmail, form]);

  useEffect(() => {
    console.log('Form dirty state:', form.formState.isDirty);
    console.log('Form values:', form.getValues());
    console.log('CC Email value:', form.watch('ccEmail'));
  }, [form.formState.isDirty, form.watch('ccEmail')]);

  

  if (isEmailPending) {
    return <LoadingSpinner />;
  }

 
  return (
    <div className="w-full space-y-8">
      

      <Form {...form}>
        <form className="w-full space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          
          {/* Email Preferences Card */}
          <Card className={cn('w-full border-2', {
            'opacity-50': isFreePlan
          })}>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-900">Email Notifications</CardTitle>
                  <CardDescription className="text-blue-700">
                    Configure how and when to send service completion emails
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {emailFields.map((field) => (
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
                            {item.name === 'ccEmail' ? (
                              // Use regular input for ccEmail
                              <input
                                {...form.register('ccEmail')}
                                type="email"
                                placeholder="Enter CC email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
                              // Use InputField for other fields
                              <InputField
                                disabled={!isFreePlan ? (isFieldSendEmails ? false : sendEmails ? false : true) : true}
                                name={item.name}
                                type={item.type || field.type}
                                placeholder={field.type === FieldType.Default ? item.label : ''}
                              />
                            )}
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
            </CardContent>
          </Card>

          {/* Filter Maintenance Card */}
          <Card className="w-full border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Filter className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-green-900">Filter Maintenance</CardTitle>
                  <CardDescription className="text-green-700">
                    Set up automatic filter cleaning schedules and reminders
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filterFields.map((field) => (
                <div key={field.label} className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                  <div className="col-span-8 row-auto flex flex-col">
                    <label htmlFor={field.label} className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800">{field.label}</span>
                    </label>
                    <span className="text-muted-foreground text-sm font-normal">{field.description}</span>
                  </div>
                  <div className="col-span-4 flex flex-col gap-2">
                    {field.itens.map((item) => (
                      <div key={item.name} className="flex w-full items-center gap-4">
                        <div className={field.type === FieldType.Default ? 'w-full' : ''}>
                          <InputField
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
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button 
              type="button"
              disabled={!form.formState.isDirty || isFreePlan || isEmailPending} 
              className="mt-2 w-full"
              onClick={() => {
                const formData = form.getValues();
                setFormData(formData);
                setShowConfirmModal(true);
              }}
            >
              {isEmailPending ? (
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
              ) : (
                'Save all preferences'
              )}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">Enable Email Notifications</DialogTitle>

            <DialogDescription className="mt-4 text-left">
              This action will change the email notifications and filter maintenance for all clients under this company. If you want specific
              clients not to receive or receive emails, you'll need to change it manually in their individual settings
              on the clients page after this action.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (formData) {
                  handleSubmit(formData);
                }
                setShowConfirmModal(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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

// Separate email fields
const emailFields: Fields = [
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
        name: 'ccEmail',
        type: FieldType.Default
      }
    ],
    label: 'Cc E-mail',
    type: FieldType.Default
  }
];

// Update the filter fields array
const filterFields: Fields = [
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
    type: FieldType.Number
  },
  {
    description: 'Set the interval in days for filter replacement.',
    itens: [
      {
        label: 'days',
        description: 'Number of days between filter replacements',
        name: 'filterReplacementIntervalDays',
        type: FieldType.Number
      }
    ],
    label: 'Filter Replacement Interval',
    type: FieldType.Number
  },
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Require technicians to take photos when cleaning or replacing filters.',
    label: 'Filter Maintenance Photos',
    itens: [
      {
        label: 'Require photo to every filter cleaned or replaced',
        description: 'Technicians must take photos when cleaning or replacing filters',
        name: 'filterCleaningMustHavePhotos'
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
        subLabel: '(only on grow plan)',
        description: 'Send e-mails when filter cleaning is completed.',
        name: 'sendFilterCleaningEmails'
      }
    ]
  }
];
