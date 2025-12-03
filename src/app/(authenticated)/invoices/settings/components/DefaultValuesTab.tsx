'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { FieldType } from '@/ts/enums/enums';
import { useUpdateInvoiceSettings, InvoiceDefaultValues } from '@/hooks/react-query/invoices/useUpdateInvoiceSettings';

const paymentTermsOptions = [
  { key: '1', value: '1', name: 'Due on 1 day' },
  { key: '3', value: '3', name: 'Due on 3 days' },
  { key: '7', value: '7', name: 'Due on 7 days' },
  { key: '15', value: '15', name: 'Due on 15 days' },
  { key: '30', value: '30', name: 'Due on 30 days' },
  { key: '60', value: '60', name: 'Due on 60 days' }
];

const frequencyOptions = [
  { key: 'weekly', value: 'weekly', name: 'Weekly' },
  { key: 'monthly', value: 'monthly', name: 'Monthly' },
  { key: 'yearly', value: 'yearly', name: 'Yearly' }
];

export function DefaultValuesTab() {
  const form = useFormContext<{ defaults: InvoiceDefaultValues }>();
  const { mutate: updateSettings, isPending } = useUpdateInvoiceSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = form.getValues('defaults');
    updateSettings({ type: 'defaults', data });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Default Values</h2>
          <div className="space-y-4">
            <InputField
              name="defaults.paymentInstructions"
              label="Payment Instructions"
              placeholder="Enter default payment instructions"
              type={FieldType.TextArea}
            />

            <InputField
              name="defaults.notes"
              label="Notes"
              placeholder="Enter default notes"
              type={FieldType.TextArea}
            />

            <SelectField
              name="defaults.frequency"
              label="Default Frequency"
              placeholder="Select default frequency"
              options={frequencyOptions}
            />

            <SelectField
              name="defaults.paymentTerm"
              label="Default Payment Term"
              placeholder="Select default payment term"
              options={paymentTermsOptions}
            />
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

