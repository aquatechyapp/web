'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import { Mail, ChevronDown } from 'lucide-react';

import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';
import { useUpdateCompanyPreferences } from '@/hooks/react-query/companies/updatePreferences';
import { Company } from '@/ts/interfaces/Company';

const schema = z.object({
  sendEmails: z.boolean(),
  // attachChemicalsReadings: z.boolean(),
  // attachChecklist: z.boolean(),
  // attachServicePhotos: z.boolean(),

  // New fields
  attachReadingsGroups: z.boolean(),
  attachConsumablesGroups: z.boolean(),
  attachPhotoGroups: z.boolean(),
  attachSelectorsGroups: z.boolean(),
  attachCustomChecklist: z.boolean(),

  ccEmail: z.string(),
});

interface EmailPreferencesCardProps {
  company: Company;
  form: any;
  onEmailSubmit: (data: z.infer<typeof schema>) => void;
  emailFieldsChanged: () => boolean;
}

const emailFields = [
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
        label: 'Consumables',
        description: 'Send e-mails with consumables.',
        name: 'attachConsumablesGroups'
      },
      {
        label: 'Readings',
        description: 'Send e-mails with readings.',
        name: 'attachReadingsGroups'
      },
      {
        label: 'Photos',
        description: 'Send e-mails with photos.',
        name: 'attachPhotoGroups'
      },
      {
        label: 'Selectors',
        description: 'Send e-mails with selectors.',
        name: 'attachSelectorsGroups'
      },
      {
        label: 'Checklist',
        description: 'Send e-mails with checklist.',
        name: 'attachCustomChecklist'
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

export function EmailPreferencesCard({
  company,
  form,
  onEmailSubmit,
  emailFieldsChanged
}: EmailPreferencesCardProps) {
  const { isPending: isEmailPending } = useUpdateCompanyPreferences(company.id);
  const { isFreePlan } = useUserStore(
    useShallow((state) => ({
      isFreePlan: state.isFreePlan
    }))
  );

  const [collapsed, setCollapsed] = useState(true);
  const sendEmails = form.watch('sendEmails');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Card className={cn('w-full border-2', {
      'opacity-50': isFreePlan
    })}>
      <CardHeader
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
        onClick={toggleCollapsed}
      >
        <div className="flex items-center justify-between">
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
          <ChevronDown
            className={cn(
              "h-5 w-5 text-blue-600 transition-transform duration-200",
              collapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </CardHeader>
      {!collapsed && (
        <>
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
                              disabled={isFreePlan}
                              className={cn(
                                "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                isFreePlan && "opacity-50 cursor-not-allowed bg-gray-100"
                              )}
                            />
                          ) : (
                            // Use InputField for other fields
                            <InputField
                              disabled={!isFreePlan ? (isFieldSendEmails ? false : sendEmails ? false : true) : true}
                              name={item.name}
                              type={'type' in item ? item.type : field.type}
                              placeholder={field.type === FieldType.Default ? item.label : ''}
                            />
                          )}
                        </div>
                        {field.type === FieldType.Switch && (
                          <label htmlFor={item.label}>
                            <div>
                              <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                            </div>
                            {'subLabel' in item && item.subLabel ? (
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

          {/* Email Preferences Save Button */}
          <div className="border-t bg-gray-50 p-4">
            <div className="flex justify-center">
              <Button
                type="button"
                disabled={!emailFieldsChanged() || isFreePlan || isEmailPending}
                className="w-full max-w-xs"
                onClick={() => {
                  const formData = form.getValues();
                  onEmailSubmit(formData);
                }}
              >
                {isEmailPending ? (
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
                ) : (
                  'Save Email Preferences'
                )}
              </Button>
            </div>
            {isFreePlan && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Email notifications are only available on the Grow plan
              </p>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
