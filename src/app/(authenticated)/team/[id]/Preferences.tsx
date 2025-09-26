'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';
import { useUpdateCompanyPreferences } from '@/hooks/react-query/companies/updatePreferences';
// ChecklistTemplate hook no longer needed as it's managed separately
import { Company, } from '@/ts/interfaces/Company';
import { 
  EmailPreferencesCard, 
  FilterMaintenanceCard, 
  ChecklistTemplatesCard,
  ReadingAndConsumableGroupsCard,
  ServiceTypesCard,
} from './components';
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
  filterCleaningIntervalDays: z.coerce.number().min(1),
  filterReplacementIntervalDays: z.coerce.number().min(1),
  filterCleaningMustHavePhotos: z.boolean(),
  sendFilterCleaningEmails: z.boolean()
});

export default function Page({ company }: { company: Company }) {
  const { isPending: isEmailPending, mutate: updateEmailPrefs } = useUpdateCompanyPreferences(company.id);
  // Checklist templates are now managed separately
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
      // attachChemicalsReadings: isFreePlan
      //   ? false
      //   : company.preferences?.serviceEmailPreferences?.attachChemicalsReadings || false,
      // attachChecklist: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachChecklist || false,
      // attachServicePhotos: isFreePlan
      //   ? false
      //   : company.preferences?.serviceEmailPreferences?.attachServicePhotos || false,
      ccEmail: isFreePlan ? '' : company.preferences?.serviceEmailPreferences?.ccEmail || '',
      filterCleaningIntervalDays: company.preferences?.equipmentMaintenancePreferences?.filterCleaningIntervalDays || 28,
      filterReplacementIntervalDays: company.preferences?.equipmentMaintenancePreferences?.filterReplacementIntervalDays || 365,
      filterCleaningMustHavePhotos: company.preferences?.equipmentMaintenancePreferences?.filterCleaningMustHavePhotos || false,
      sendFilterCleaningEmails: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.sendFilterCleaningEmails || false,

      // New fields
      attachReadingsGroups: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachReadingsGroups || false,
      attachConsumablesGroups: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachConsumablesGroups || false,
      attachPhotoGroups: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachPhotoGroups || false,
      attachSelectorsGroups: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachSelectorsGroups || false,
      attachCustomChecklist: isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachCustomChecklist || false
    }
  });

  const sendEmails = form.watch('sendEmails');

  // Use useCallback to prevent infinite re-renders
  const handleEmailsChange = useCallback((newSendEmails: boolean) => {
    if (newSendEmails) {
      // form.setValue('attachChemicalsReadings', true, { shouldDirty: true });
      // form.setValue('attachChecklist', true, { shouldDirty: true });
      // form.setValue('attachServicePhotos', true, { shouldDirty: true });
      form.setValue('attachReadingsGroups', true, { shouldDirty: true });
      form.setValue('attachConsumablesGroups', true, { shouldDirty: true });
      form.setValue('attachPhotoGroups', true, { shouldDirty: true });
      form.setValue('attachSelectorsGroups', true, { shouldDirty: true });
      form.setValue('attachCustomChecklist', true, { shouldDirty: true });
    } else {
      // form.setValue('attachChemicalsReadings', false, { shouldDirty: true });
      // form.setValue('attachChecklist', false, { shouldDirty: true });
      // form.setValue('attachServicePhotos', false, { shouldDirty: true });
      form.setValue('attachReadingsGroups', false, { shouldDirty: true });
      form.setValue('attachConsumablesGroups', false, { shouldDirty: true });
      form.setValue('attachPhotoGroups', false, { shouldDirty: true });
      form.setValue('attachSelectorsGroups', false, { shouldDirty: true });
      form.setValue('attachCustomChecklist', false, { shouldDirty: true });
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
  const [modalType, setModalType] = useState<'email' | 'filter'>('email');

  const filterDays = form.watch('filterCleaningIntervalDays');

  // Watch form values to detect changes for each section
  const watchedValues = form.watch();
  
  // Check if email fields have changed
  const emailFieldsChanged = () => {
    // const emailFields = ['sendEmails', 'attachChemicalsReadings', 'attachChecklist', 'attachServicePhotos', 'ccEmail'];
    const emailFields = ['sendEmails', 'attachReadingsGroups', 'attachConsumablesGroups', 'attachPhotoGroups', 'attachSelectorsGroups', 'attachCustomChecklist', 'ccEmail'];
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

  // Customizations are now handled separately in ChecklistTemplatesCard

  // Helper function to get original values
  const getOriginalValue = (field: string) => {
    switch (field) {
      case 'sendEmails':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.sendEmails || false;
      // case 'attachChemicalsReadings':
      //   return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachChemicalsReadings || false;
      // case 'attachChecklist':
      //   return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachChecklist || false;
      // case 'attachServicePhotos':
      //   return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachServicePhotos || false;
      case 'attachReadingsGroups':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachReadingsGroups || false;
      case 'attachConsumablesGroups':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachConsumablesGroups || false;
      case 'attachPhotoGroups':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachPhotoGroups || false;
      case 'attachSelectorsGroups':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachSelectorsGroups || false;
      case 'attachCustomChecklist':
        return isFreePlan ? false : company.preferences?.serviceEmailPreferences?.attachCustomChecklist || false;
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
      // attachChemicalsReadings,
      // attachChecklist,
      // attachServicePhotos,
      attachReadingsGroups,
      attachConsumablesGroups,
      attachPhotoGroups,
      attachSelectorsGroups,
      attachCustomChecklist,
      ccEmail
    } = data;

    const updateData = {
      serviceEmailPreferences: {
        sendEmails,
        // attachChemicalsReadings,
        // attachChecklist,
        // attachServicePhotos,
        attachReadingsGroups,
        attachConsumablesGroups,
        attachPhotoGroups,
        attachSelectorsGroups,
        attachCustomChecklist,
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

  // Checklist templates are now managed separately in ChecklistTemplatesCard

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



  if (isEmailPending) {
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
          <EmailPreferencesCard
            company={company}
            form={form}
            onEmailSubmit={(data) => {
              setFormData(data);
              setModalType('email');
              setShowConfirmModal(true);
            }}
            emailFieldsChanged={emailFieldsChanged}
          />

          {/* Filter Maintenance Card */}
          <FilterMaintenanceCard
            company={company}
            form={form}
            onFilterSubmit={(data) => {
              setFormData(data);
              setModalType('filter');
              setShowConfirmModal(true);
            }}
            filterFieldsChanged={filterFieldsChanged}
          />

          {/* Checklist Templates Card */}
          <ChecklistTemplatesCard company={company} />

          {/* Reading and Consumable Groups Card */}
          <ReadingAndConsumableGroupsCard company={company} />

          {/* Service Types Card */}
          <ServiceTypesCard company={company} />

        </form>
      </Form>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl mb-4">
              {modalType === 'email' 
                ? 'Update Email Preferences' 
                : 'Update Filter Maintenance'
              }
            </DialogTitle>

            <DialogDescription className="mt-4 text-left">
              {modalType === 'email' 
                ? (
                  <>
                    This action will set the email notification preferences for all NEW CLIENTS created from now on under this company.
                    <br /><br />
                    Clients created before this change will need to be updated manually in their individual settings on the clients page or using the bulk actions page.
                    <br /><br />
                    <strong>Note:</strong> In order to send service emails, both the client preferences AND company preferences must be enabled.
                  </>
                )
                : (
                  <>
                    This action will change the filter maintenance preferences for all NEW CLIENTS created from now on under this company. This includes cleaning intervals, replacement schedules, and photo requirements.
                    <br /><br />
                    Clients created before this change will need to be updated manually in their individual settings on the clients page or using the bulk actions page. The photo requirement to filter cleaning is the only preference that will be updated for all clients including the previous ones.
                    <br /><br />
                    <strong>Note:</strong> In order to send filter cleaning emails, both the client preferences AND company preferences must be enabled.
                  </>
                )
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
                  } else {
                    handleFilterSubmit(formData);
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

