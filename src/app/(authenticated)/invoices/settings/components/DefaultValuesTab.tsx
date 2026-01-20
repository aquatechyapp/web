'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { FieldType } from '@/ts/enums/enums';
import { InvoiceDefaultValues } from '@/ts/interfaces/Company';
import { useUpdateInvoiceDefaultValues } from '@/hooks/react-query/invoices/useUpdateInvoiceSettings';
import useGetCompany from '@/hooks/react-query/companies/getCompany';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { RecurringInvoiceFrequency, PaymentTermsDays } from '@/ts/interfaces/RecurringInvoiceTemplate';
import { editInvoiceDefaultValuesSchema } from '@/schemas/invoiceDefaultValues';
import { zodResolver } from '@hookform/resolvers/zod';

const frequencyOptions = [
  { key: RecurringInvoiceFrequency.Weekly, value: RecurringInvoiceFrequency.Weekly, name: 'Weekly' },
  { key: RecurringInvoiceFrequency.Monthly, value: RecurringInvoiceFrequency.Monthly, name: 'Monthly' },
  { key: RecurringInvoiceFrequency.Each2Months, value: RecurringInvoiceFrequency.Each2Months, name: 'Every 2 Months' },
  { key: RecurringInvoiceFrequency.Each3Months, value: RecurringInvoiceFrequency.Each3Months, name: 'Every 3 Months' },
  { key: RecurringInvoiceFrequency.Each4Months, value: RecurringInvoiceFrequency.Each4Months, name: 'Every 4 Months' },
  { key: RecurringInvoiceFrequency.Each6Months, value: RecurringInvoiceFrequency.Each6Months, name: 'Every 6 Months' },
  { key: RecurringInvoiceFrequency.Yearly, value: RecurringInvoiceFrequency.Yearly, name: 'Yearly' }
];

const paymentTermsOptions = [
  { key: PaymentTermsDays.OneDay, value: PaymentTermsDays.OneDay, name: 'Due on 1 day' },
  { key: PaymentTermsDays.ThreeDays, value: PaymentTermsDays.ThreeDays, name: 'Due on 3 days' },
  { key: PaymentTermsDays.SevenDays, value: PaymentTermsDays.SevenDays, name: 'Due on 7 days' },
  { key: PaymentTermsDays.FifteenDays, value: PaymentTermsDays.FifteenDays, name: 'Due on 15 days' },
  { key: PaymentTermsDays.ThirtyDays, value: PaymentTermsDays.ThirtyDays, name: 'Due on 30 days' },
  { key: PaymentTermsDays.SixtyDays, value: PaymentTermsDays.SixtyDays, name: 'Due on 60 days' }
];

interface DefaultValuesTabProps {
  companyId?: string;
}

export function DefaultValuesTab({ companyId }: DefaultValuesTabProps) {

  // Fetch company data to get default values preferences
  const { data: company, isLoading: isLoadingCompany } = useGetCompany(companyId || '');

  const form = useForm<z.infer<typeof editInvoiceDefaultValuesSchema>>({
    resolver: zodResolver(editInvoiceDefaultValuesSchema),
    defaultValues: {
      paymentInstructions: company.preferences?.invoiceSettingsPreferences?.defaultValues?.paymentInstructions || '',
      notes: company.preferences?.invoiceSettingsPreferences?.defaultValues?.notes || '',
      defaultFrequency: company.preferences?.invoiceSettingsPreferences?.defaultValues?.defaultFrequency || '',
      defaultPaymentTerm: company.preferences?.invoiceSettingsPreferences?.defaultValues?.defaultPaymentTerm || '',
    }
  });

  // Reset form values when company data loads or changes
  useEffect(() => {
    if (!isLoadingCompany && company) {
      const defaultValues = company.preferences?.invoiceSettingsPreferences?.defaultValues;
      form.reset({
        paymentInstructions: defaultValues?.paymentInstructions || '',
        notes: defaultValues?.notes || '',
        defaultFrequency: defaultValues?.defaultFrequency || undefined,
        defaultPaymentTerm: defaultValues?.defaultPaymentTerm || undefined,
      });
    }
  }, [company, isLoadingCompany, form]);

  const { mutate: updateSettings, isPending } = useUpdateInvoiceDefaultValues(companyId || '');

  // Show loading spinner while loading company data or if no companyId
  if (!companyId || isLoadingCompany) {
    return <LoadingSpinner />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;
    
    // Get all four fields - API requires all-or-nothing
    const data = form.getValues();
    
    // Ensure all four fields are provided together (API requirement)
    // Use defaults if any field is missing
    const requestData: InvoiceDefaultValues = {
      paymentInstructions: data.paymentInstructions,
      notes: data.notes,
      defaultFrequency: data.defaultFrequency as RecurringInvoiceFrequency,
      defaultPaymentTerm: data.defaultPaymentTerm as PaymentTermsDays
    };
    
    updateSettings(requestData);
  };


  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Default Values</h2>
          <div className="space-y-4">
            <InputField
              name="paymentInstructions"
              label="Payment Instructions"
              placeholder="Enter default payment instructions"
              type={FieldType.TextArea}
            />

            <InputField
              name="notes"
              label="Notes"
              placeholder="Enter default notes"
              type={FieldType.TextArea}
            />

            {
              company.preferences?.invoiceSettingsPreferences?.defaultValues?.defaultFrequency && (
                <SelectField
                  name="defaultFrequency"
                  label="Default Frequency"
                  placeholder="Select default frequency"
                  options={frequencyOptions}
                  value={form.watch('defaultFrequency') as RecurringInvoiceFrequency}
                />
              )
            }

            {
              company.preferences?.invoiceSettingsPreferences?.defaultValues?.defaultPaymentTerm && (
                <SelectField
                  name="defaultPaymentTerm"
                  label="Default Payment Term"
                  placeholder="Select default payment term"
                  options={paymentTermsOptions}
                  value={form.watch('defaultPaymentTerm') as PaymentTermsDays}
                />
              ) 
            }

          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Default Values'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

