'use client';

import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/InputField';
import { InvoiceCompanyInformation } from '@/ts/interfaces/Company';
import { useUpdateInvoiceCompanyInformation } from '@/hooks/react-query/invoices/useUpdateInvoiceSettings';
import useGetCompany from '@/hooks/react-query/companies/getCompany';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface CompanyInformationTabProps {
  companyId?: string;
}

export function CompanyInformationTab({ companyId }: CompanyInformationTabProps) {
  const form = useFormContext<{ company: InvoiceCompanyInformation }>();
  
  // Fetch company data to get company information preferences
  const { data: company, isLoading: isLoadingCompany } = useGetCompany(companyId || '');
  
  // Use ref to track the last companyId we loaded to prevent overwriting user input
  const lastLoadedCompanyIdRef = useRef<string | undefined>(undefined);

  // Reset ref when companyId changes so we reload data for new company
  useEffect(() => {
    if (lastLoadedCompanyIdRef.current !== companyId) {
      lastLoadedCompanyIdRef.current = undefined;
    }
  }, [companyId]);

  // Load company information preferences from company data when it's available (only once per company)
  useEffect(() => {
    // Don't run if we don't have companyId, are still loading, don't have company data, or already loaded this company
    if (!companyId || isLoadingCompany || !company || lastLoadedCompanyIdRef.current === companyId) return;
    
    // Only load from company data if the form field hasn't been set yet (to avoid overwriting user edits)
    // Check both the value and if the field has been touched/dirty
    const currentValue = form.getValues('company.replyToEmail');
    const isDirty = form.formState.dirtyFields.company?.replyToEmail;
    const isTouched = form.formState.touchedFields.company?.replyToEmail;
    
    // If form already has a value and it's been touched or is dirty, don't overwrite it
    if ((currentValue !== null && currentValue !== undefined && currentValue !== '') || isDirty || isTouched) {
      // Form already has a value or has been edited, don't overwrite it
      lastLoadedCompanyIdRef.current = companyId;
      return;
    }
    
    const companyInfo = company.preferences?.invoiceSettingsPreferences?.companyInformation;
    
    // Set the replyToEmail value, defaulting to company email if not set
    const replyToEmail = companyInfo?.replyToEmail ?? company.email ?? null;
    
    form.setValue('company.replyToEmail', replyToEmail, { 
      shouldDirty: false, 
      shouldValidate: true,
      shouldTouch: false 
    });
    
    // Mark this company as loaded to prevent re-running
    lastLoadedCompanyIdRef.current = companyId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, isLoadingCompany, companyId]); // form is stable from useFormContext, no need to include

  // Update form value after successful mutation to keep it in sync
  const { mutate: updateSettings, isPending } = useUpdateInvoiceCompanyInformation(companyId || '', {
    onSuccess: (_, variables) => {
      // Update form value with the saved value to keep it in sync
      form.setValue('company.replyToEmail', variables.replyToEmail ?? null, {
        shouldDirty: false,
        shouldValidate: true,
        shouldTouch: false
      });
    }
  });

  // Show loading spinner while loading company data or if no companyId
  if (!companyId || isLoadingCompany) {
    return <LoadingSpinner />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;
    const data = form.getValues('company');
    updateSettings(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Company Information</h2>
          <div className="space-y-4">
            <InputField
              name="company.replyToEmail"
              label="Reply-to Email"
              placeholder="Enter reply-to email (defaults to company email)"
            />
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Company Information'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

