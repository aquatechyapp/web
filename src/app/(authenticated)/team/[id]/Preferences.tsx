'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import { Mail, Filter, Settings, CheckSquare, Plus, Trash2, Edit3 } from 'lucide-react';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';
import { useUpdateCompanyPreferences } from '@/hooks/react-query/companies/updatePreferences';
import { useUpdateChecklistTemplate } from '@/hooks/react-query/checklist-templates/useUpdateChecklistTemplate';
import { Company, ChecklistTemplateItem } from '@/ts/interfaces/Company';
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
  sendFilterCleaningEmails: z.boolean(),
  customChecklistItems: z.array(z.object({
    id: z.string().optional(),
    label: z.string(),
    description: z.string().optional()
  })).default([])
});

export default function Page({ company }: { company: Company }) {
  const { isPending: isEmailPending, mutate: updateEmailPrefs } = useUpdateCompanyPreferences(company.id);
  const { isPending: isChecklistPending, mutate: updateChecklistTemplate } = useUpdateChecklistTemplate(company.checklistTemplates[0].id);
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
      sendFilterCleaningEmails: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.sendFilterCleaningEmails || false,
      customChecklistItems: company.checklistTemplates?.[0]?.items || []
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
  const [modalType, setModalType] = useState<'email' | 'filter' | 'customizations'>('email');

  // Add state for managing checklist items
  const [customChecklist, setCustomChecklist] = useState<ChecklistTemplateItem[]>(
    company.checklistTemplates?.[0]?.items || []
  );
  const [newChecklistItem, setNewChecklistItem] = useState<ChecklistTemplateItem>({
    id: '',
    templateId: '',
    label: '',
    order: 0,
    createdAt: new Date()
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const filterDays = form.watch('filterCleaningIntervalDays');
  const [initialFilterDays] = useState(filterDays);

  // Watch form values to detect changes for each section
  const watchedValues = form.watch();
  
  // Check if email fields have changed
  const emailFieldsChanged = () => {
    const emailFields = ['sendEmails', 'attachChemicalsReadings', 'attachChecklist', 'attachServicePhotos', 'ccEmail'];
    return emailFields.some(field => {
      const currentValue = watchedValues[field as keyof typeof watchedValues];
      const originalValue = getOriginalValue(field);
      return currentValue !== originalValue;
    });
  };

  // Check if filter fields have changed
  const filterFieldsChanged = () => {
    const filterFields = ['filterCleaningIntervalDays', 'filterReplacementIntervalDays', 'filterCleaningMustHavePhotos', 'sendFilterCleaningEmails'];
    return filterFields.some(field => {
      const currentValue = watchedValues[field as keyof typeof watchedValues];
      const originalValue = getOriginalValue(field);
      return currentValue !== originalValue;
    });
  };

  // Check if customization fields have changed
  const customizationsFieldsChanged = () => {
    return form.formState.isDirty && JSON.stringify(watchedValues.customChecklistItems) !== JSON.stringify(company.checklistTemplates?.[0]?.items || []);
  };

  // Helper function to get original values
  const getOriginalValue = (field: string) => {
    switch (field) {
      case 'sendEmails':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.sendEmails || false;
      case 'attachChemicalsReadings':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachChemicalsReadings || false;
      case 'attachChecklist':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachChecklist || false;
      case 'attachServicePhotos':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachServicePhotos || false;
      case 'ccEmail':
        return isFreePlan ? '' : company.preferences?.serviceEmailPreferences?.ccEmail || '';
      case 'filterCleaningIntervalDays':
        return company.preferences?.equipmentMaintenancePreferences?.filterCleaningIntervalDays || 28;
      case 'filterReplacementIntervalDays':
        return company.preferences?.equipmentMaintenancePreferences?.filterReplacementIntervalDays || 365;
      case 'filterCleaningMustHavePhotos':
        return company.preferences?.equipmentMaintenancePreferences?.filterCleaningMustHavePhotos || false;
      case 'sendFilterCleaningEmails':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.sendFilterCleaningEmails || false;
      default:
        return null;
    }
  };

  // Handle email preferences submission
  const handleEmailSubmit = (data: z.infer<typeof schema>) => {
    const { 
      sendEmails,
      attachChemicalsReadings,
      attachChecklist,
      attachServicePhotos,
      ccEmail
    } = data;

    const updateData = {
      serviceEmailPreferences: {
        sendEmails,
        attachChemicalsReadings,
        attachChecklist,
        attachServicePhotos,
        ccEmail
      },
      companyId: company.id
    };

    updateEmailPrefs(updateData);
  };

  // Handle filter maintenance submission
  const handleFilterSubmit = (data: z.infer<typeof schema>) => {
    const { 
      filterCleaningIntervalDays, 
      filterReplacementIntervalDays, 
      filterCleaningMustHavePhotos,
      sendFilterCleaningEmails
    } = data;

    const updateData = {
      equipmentMaintenancePreferences: {
        filterCleaningIntervalDays: Number(filterCleaningIntervalDays),
        filterReplacementIntervalDays: Number(filterReplacementIntervalDays),
        filterCleaningMustHavePhotos
      },
      serviceEmailPreferences: {
        sendFilterCleaningEmails
      },
      companyId: company.id
    };

    updateEmailPrefs(updateData);
  };

  // Handle customizations submission
  const handleCustomizationsSubmit = (data: z.infer<typeof schema>) => {
    const { customChecklistItems } = data;

    // Update checklist template if it exists
    if (company.checklistTemplates?.[0]?.id && customChecklistItems.length > 0) {
      const checklistUpdateData = {
        templateId: company.checklistTemplates[0].id,
        items: customChecklistItems.map((item, index) => ({
          label: item.label,
          order: index + 1
        }))
      };
      updateChecklistTemplate(checklistUpdateData);
    }
  };

  const ccEmail = form.watch('ccEmail');

  const originalCcEmail = company.preferences?.serviceEmailPreferences?.ccEmail || '';
  
  useEffect(() => {
    if (ccEmail !== originalCcEmail) {
      // Force the form to recognize the change
      form.setValue('ccEmail', ccEmail, { shouldDirty: true, shouldTouch: true });
    }
  }, [ccEmail, originalCcEmail, form]);

  useEffect(() => {
    console.log('Form dirty state:', form.formState.isDirty);
    console.log('Form values:', form.getValues());
    console.log('CC Email value:', ccEmail);
  }, [form.formState.isDirty, ccEmail, form]);

  // Add checklist management functions
  const addChecklistItem = () => {
    if (newChecklistItem.label.trim() && !customChecklist.some(item => item.label === newChecklistItem.label.trim())) {
      const newItem: ChecklistTemplateItem = {
        id: Date.now().toString(),
        label: newChecklistItem.label.trim(),
        order: customChecklist.length + 1,
        createdAt: new Date(),
        templateId: company.checklistTemplates?.[0]?.id || ''
      };
      const updatedList = [...customChecklist, newItem];
      setCustomChecklist(updatedList);
      form.setValue('customChecklistItems', updatedList, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setNewChecklistItem({
        id: '',
        templateId: '',
        label: '',
        order: 0,
        createdAt: new Date()
      });
    }
  };

  const removeChecklistItem = (index: number) => {
    const updatedList = customChecklist.filter((_, i) => i !== index);
    setCustomChecklist(updatedList);
    form.setValue('customChecklistItems', updatedList, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(customChecklist[index].label);
  };

  const saveEdit = () => {
    if (editingText.trim() && editingIndex !== null) {
      const updatedList = [...customChecklist];
      updatedList[editingIndex] = {
        ...updatedList[editingIndex],
        label: editingText.trim()
      };
      setCustomChecklist(updatedList);
      form.setValue('customChecklistItems', updatedList, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  if (isEmailPending || isChecklistPending) {
    return <LoadingSpinner />;
  }

 
  return (
    <div className="w-full space-y-8">
      

      <Form {...form}>
        <form className="w-full space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            // Form submission is now handled by individual buttons
          }}
        >
          
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
            
            {/* Email Preferences Save Button */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex justify-center">
                <Button 
                  type="button"
                  disabled={!emailFieldsChanged() || isFreePlan || isEmailPending} 
                  className="w-full max-w-xs"
                  onClick={() => {
                    const formData = form.getValues();
                    setFormData(formData);
                    setModalType('email');
                    setShowConfirmModal(true);
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
                    {field.itens.map((item) => {
                      const isFilterEmailField = item.name === 'sendFilterCleaningEmails';

                      return (
                        <div key={item.name} className="flex w-full items-center gap-4">
                          <div className={field.type === FieldType.Default ? 'w-full' : ''}>
                            <InputField
                              disabled={isFilterEmailField && isFreePlan}
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
            </CardContent>
            
            {/* Filter Maintenance Save Button */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex justify-center">
                <Button 
                  type="button"
                  disabled={!filterFieldsChanged() || isEmailPending} 
                  className="w-full max-w-xs"
                  onClick={() => {
                    const formData = form.getValues();
                    setFormData(formData);
                    setModalType('filter');
                    setShowConfirmModal(true);
                  }}
                >
                  {isEmailPending ? (
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
                  ) : (
                    'Save Filter Preferences'
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Custom Checklist Card */}
          <Card className="w-full border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-purple-900">Custom Service Checklist</CardTitle>
                  <CardDescription className="text-purple-700">
                    Create and manage custom checklist items for your service reports
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Add New Item */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem.label}
                  onChange={(e) => setNewChecklistItem({ ...newChecklistItem, label: e.target.value })}
                  placeholder="Enter new checklist item..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                />
                <Button
                  type="button"
                  onClick={addChecklistItem}
                  disabled={!newChecklistItem.label.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800">Current Checklist Items:</h4>
                {customChecklist.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No checklist items yet. Add your first item above.</p>
                ) : (
                  <div className="space-y-2">
                    {customChecklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <CheckSquare className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        {editingIndex === index ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              autoFocus
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={saveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 h-8"
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="px-2 py-1 h-8"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1 text-sm text-gray-800">{item.label}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(index)}
                              className="p-1 h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeChecklistItem(index)}
                              className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>Note:</strong> These checklist items will be used as the default template for all new service reports. 
                  You can have up to 20 custom items.
                </p>
              </div>
            </CardContent>
            
            {/* Customizations Save Button */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex justify-center">
                <Button 
                  type="button"
                  disabled={!customizationsFieldsChanged() || isChecklistPending} 
                  className="w-full max-w-xs"
                  onClick={() => {
                    const formData = form.getValues();
                    setFormData(formData);
                    setModalType('customizations');
                    setShowConfirmModal(true);
                  }}
                >
                  {isChecklistPending ? (
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
                  ) : (
                    'Save Customizations'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </Form>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">
              {modalType === 'email' 
                ? 'Update Email Preferences' 
                : modalType === 'filter' 
                  ? 'Update Filter Maintenance' 
                  : 'Save Customizations'
              }
            </DialogTitle>

            <DialogDescription className="mt-4 text-left">
              {modalType === 'email' 
                ? 'This action will change the email notification preferences for all clients under this company. If you want specific clients not to receive or receive emails, you\'ll need to change it manually in their individual settings on the clients page after this action.'
                : modalType === 'filter'
                  ? 'This action will change the filter maintenance preferences for all clients under this company. This includes cleaning intervals, replacement schedules, and photo requirements.'
                  : 'This action will update the custom checklist template for all new service reports. Existing service reports will not be affected.'
              }
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (formData) {
                  if (modalType === 'email') {
                    handleEmailSubmit(formData);
                  } else if (modalType === 'filter') {
                    handleFilterSubmit(formData);
                  } else {
                    handleCustomizationsSubmit(formData);
                  }
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
