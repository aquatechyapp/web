'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { ServiceType } from '@/ts/interfaces/ServiceTypes';
import { ServiceTypeEmailPreferences } from '@/ts/interfaces/ServiceTypeEmailPreferences';
import { useGetServiceTypes } from '@/hooks/react-query/service-types/useGetServiceTypes';
import { useUpdateServiceTypeEmailPreferences } from '@/hooks/react-query/service-types/useUpdateServiceTypeEmailPreferences';

const serviceTypeEmailSchema = z.object({
  sendAutomaticEmails: z.boolean(),
  header: z.string().optional(),
  body: z.string().optional(),
  footer: z.string().optional(),
  technicianNotes: z.boolean(),
  sendReadingsGroups: z.boolean(),
  sendConsumablesGroups: z.boolean(),
  sendPhotoGroups: z.boolean(),
  sendSelectorsGroups: z.boolean(),
  sendChecklist: z.boolean(),
});

const schema = z.record(z.string(), serviceTypeEmailSchema);

interface EmailPreferencesCardProps {
  company: Company;
  form: any;
  onEmailSubmit: (data: z.infer<typeof schema>) => void;
  emailFieldsChanged: () => boolean;
}

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

  const [collapsedServiceTypes, setCollapsedServiceTypes] = useState<Record<string, boolean>>({});
  const [mainCardCollapsed, setMainCardCollapsed] = useState(true);

  const toggleMainCardCollapsed = () => {
    setMainCardCollapsed(!mainCardCollapsed);
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
    <div className="w-full space-y-4">
      <Card className={cn('w-full border-2', {
        'opacity-50': isFreePlan
      })}>
        <CardHeader 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
          onClick={toggleMainCardCollapsed}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">Email Notifications</CardTitle>
                <CardDescription className="text-blue-700">
                  Configure email preferences for each service type
                </CardDescription>
              </div>
            </div>
            <ChevronDown 
              className={cn(
                "h-5 w-5 text-blue-600 transition-transform duration-200",
                mainCardCollapsed ? "rotate-180" : "rotate-0"
              )}
            />
          </div>
        </CardHeader>
        
        {!mainCardCollapsed && (
          <EmailPreferencesContent 
            company={company}
            form={form}
            onEmailSubmit={onEmailSubmit}
            emailFieldsChanged={emailFieldsChanged}
            isEmailPending={isEmailPending}
            isFreePlan={isFreePlan}
            collapsedServiceTypes={collapsedServiceTypes}
            setCollapsedServiceTypes={setCollapsedServiceTypes}
          />
        )}
      </Card>
    </div>
  );
}

// Separate component that only loads when expanded
function EmailPreferencesContent({ 
  company, 
  form, 
  onEmailSubmit, 
  emailFieldsChanged,
  isEmailPending,
  isFreePlan,
  collapsedServiceTypes,
  setCollapsedServiceTypes
}: {
  company: Company;
  form: any;
  onEmailSubmit: (data: any) => void;
  emailFieldsChanged: () => boolean;
  isEmailPending: boolean;
  isFreePlan: boolean;
  collapsedServiceTypes: Record<string, boolean>;
  setCollapsedServiceTypes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  // NOW the hook is called only when the card is expanded
  const { data: serviceTypesData, isLoading } = useGetServiceTypes(company.id);
  const [activeServiceTypeId, setActiveServiceTypeId] = useState<string | null>(null);
  const updateEmailPreferences = useUpdateServiceTypeEmailPreferences(activeServiceTypeId || '');

  const toggleServiceTypeCollapsed = (serviceTypeId: string) => {
    setCollapsedServiceTypes((prev: Record<string, boolean>) => {
      // If the state is undefined, treat it as true (collapsed), so toggling makes it false (expanded)
      const currentState = prev[serviceTypeId] ?? true;
      return {
        ...prev,
        [serviceTypeId]: !currentState
      };
    });
  };

  const getServiceTypeEmailPreferences = (serviceType: ServiceType): ServiceTypeEmailPreferences => {
    return serviceType.serviceTypeEmailPreferences || {
      sendAutomaticEmails: false,
      technicianNotes: false,
      sendReadingsGroups: false,
      sendConsumablesGroups: false,
      sendPhotoGroups: false,
      sendSelectorsGroups: false,
      sendChecklist: false,
    };
  };

  const handleServiceTypeSubmit = (serviceTypeId: string, serviceTypeData: ServiceTypeEmailPreferences) => {
    updateEmailPreferences.mutate(serviceTypeData);
  };

  const serviceTypes = useMemo(() => serviceTypesData?.serviceTypes || [], [serviceTypesData?.serviceTypes]);

  // Set default values when service types data loads
  useEffect(() => {
    if (serviceTypes.length > 0) {
      serviceTypes.forEach((serviceType) => {
        const emailPrefs = getServiceTypeEmailPreferences(serviceType);
        form.setValue(`${serviceType.id}.sendAutomaticEmails`, emailPrefs.sendAutomaticEmails);
        form.setValue(`${serviceType.id}.header`, emailPrefs.header || '');
        form.setValue(`${serviceType.id}.body`, emailPrefs.body || '');
        form.setValue(`${serviceType.id}.footer`, emailPrefs.footer || '');
        form.setValue(`${serviceType.id}.technicianNotes`, emailPrefs.technicianNotes);
        form.setValue(`${serviceType.id}.sendReadingsGroups`, emailPrefs.sendReadingsGroups);
        form.setValue(`${serviceType.id}.sendConsumablesGroups`, emailPrefs.sendConsumablesGroups);
        form.setValue(`${serviceType.id}.sendPhotoGroups`, emailPrefs.sendPhotoGroups);
        form.setValue(`${serviceType.id}.sendSelectorsGroups`, emailPrefs.sendSelectorsGroups);
        form.setValue(`${serviceType.id}.sendChecklist`, emailPrefs.sendChecklist);
      });
    }
  }, [serviceTypes, form]);

  if (isLoading) {
    return (
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
          <span className="ml-2 text-sm">Loading service types...</span>
        </div>
      </CardContent>
    );
  }

  if (serviceTypes.length === 0) {
    return (
      <CardContent className="p-6">
        <div className="text-center text-gray-500">
          <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No service types found. Please create service types first.</p>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6">
      <div className="space-y-4">
        {serviceTypes.map((serviceType) => {
          const isCollapsed = collapsedServiceTypes[serviceType.id] ?? true;
          const emailPrefs = getServiceTypeEmailPreferences(serviceType);
          
          return (
            <Card key={serviceType.id} className="border border-gray-200">
              <CardHeader 
                className="bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleServiceTypeCollapsed(serviceType.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{serviceType.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {serviceType.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 text-gray-600 transition-transform duration-200",
                      isCollapsed ? "rotate-180" : "rotate-0"
                    )}
                  />
                </div>
              </CardHeader>
              
              {!isCollapsed && (
                <CardContent className="p-6 space-y-6">
                  {/* Send Automatic Emails */}
                  <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                    <div className="col-span-8 row-auto flex flex-col">
                      <label className="flex flex-col space-y-1">
                        <span className="text-sm font-semibold text-gray-800">Send Automatic Emails</span>
                      </label>
                      <span className="text-muted-foreground text-sm font-normal">
                        Automatically send emails when this service type is completed
                      </span>
                    </div>
                    <div className="col-span-4 flex items-center gap-4">
                      <InputField
                        disabled={isFreePlan}
                        name={`${serviceType.id}.sendAutomaticEmails`}
                        type={FieldType.Switch}
                      />
                    </div>
                  </div>

                  {/* Email Content Fields */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-800">Email Content</h4>
                    
                    {/* Header */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Email Header</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Custom header text for the email
                        </span>
                      </div>
                      <div className="col-span-4">
                        <textarea
                          {...form.register(`${serviceType.id}.header`)}
                          placeholder="Enter email header"
                          disabled={isFreePlan}
                          rows={3}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            isFreePlan && "opacity-50 cursor-not-allowed bg-gray-100"
                          )}
                        />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Email Body</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Main content of the email
                        </span>
                      </div>
                      <div className="col-span-4">
                        <textarea
                          {...form.register(`${serviceType.id}.body`)}
                          placeholder="Enter email body"
                          disabled={isFreePlan}
                          rows={3}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            isFreePlan && "opacity-50 cursor-not-allowed bg-gray-100"
                          )}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Email Footer</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Footer text for the email
                        </span>
                      </div>
                      <div className="col-span-4">
                        <textarea
                          {...form.register(`${serviceType.id}.footer`)}
                          placeholder="Enter email footer"
                          disabled={isFreePlan}
                          rows={3}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            isFreePlan && "opacity-50 cursor-not-allowed bg-gray-100"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Include in Emails */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-800">Include in Emails</h4>
                    
                    {/* Technician Notes */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Technician Notes</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Include technician notes in the email
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center gap-4">
                        <InputField
                          disabled={isFreePlan}
                          name={`${serviceType.id}.technicianNotes`}
                          type={FieldType.Switch}
                        />
                      </div>
                    </div>

                    {/* Reading Groups */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Reading Groups</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Include reading groups data in the email
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center gap-4">
                        <InputField
                          disabled={isFreePlan}
                          name={`${serviceType.id}.sendReadingsGroups`}
                          type={FieldType.Switch}
                        />
                      </div>
                    </div>

                    {/* Consumable Groups */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Consumable Groups</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Include consumable groups data in the email
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center gap-4">
                        <InputField
                          disabled={isFreePlan}
                          name={`${serviceType.id}.sendConsumablesGroups`}
                          type={FieldType.Switch}
                        />
                      </div>
                    </div>

                    {/* Photo Groups */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Photo Groups</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Include photo groups in the email
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center gap-4">
                        <InputField
                          disabled={isFreePlan}
                          name={`${serviceType.id}.sendPhotoGroups`}
                          type={FieldType.Switch}
                        />
                      </div>
                    </div>

                    {/* Selector Groups */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Selector Groups</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Include selector groups data in the email
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center gap-4">
                        <InputField
                          disabled={isFreePlan}
                          name={`${serviceType.id}.sendSelectorsGroups`}
                          type={FieldType.Switch}
                        />
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                      <div className="col-span-8 row-auto flex flex-col">
                        <label className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-gray-800">Checklist</span>
                        </label>
                        <span className="text-muted-foreground text-sm font-normal">
                          Include checklist data in the email
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center gap-4">
                        <InputField
                          disabled={isFreePlan}
                          name={`${serviceType.id}.sendChecklist`}
                          type={FieldType.Switch}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="border-t pt-4">
                        <div className="flex justify-center">
                          <Button 
                            type="button"
                            disabled={isFreePlan || updateEmailPreferences.isPending} 
                            className="w-full max-w-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveServiceTypeId(serviceType.id);
                              const formData = form.getValues();
                              const serviceTypeData = formData[serviceType.id];
                              if (serviceTypeData) {
                                handleServiceTypeSubmit(serviceType.id, serviceTypeData);
                              }
                            }}
                          >
                            {updateEmailPreferences.isPending ? (
                          <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
                        ) : (
                          `Save ${serviceType.name} Preferences`
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
      
      {isFreePlan && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-center text-sm text-yellow-800">
            Email notifications are only available on the Grow plan
          </p>
        </div>
      )}
    </CardContent>
  );
}