'use client';

import { useFormContext } from 'react-hook-form';
import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/InputField';
import { FieldType } from '@/ts/enums/enums';
import { useUpdateInvoiceSettings, InvoiceCommunicationSettings } from '@/hooks/react-query/invoices/useUpdateInvoiceSettings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Sample data for preview
const sampleData = {
  'invoice_number': 'INV-2024-001',
  'invoiceNumber': 'INV-2024-001',
  'client.firstName': 'John',
  'client.lastName': 'Doe',
  'client.name': 'John Doe',
  'company.name': 'Aquatechy Pool Services',
  'invoice.amount': '$150.00',
  'invoice.total': '$162.00',
  'invoice.dueDate': 'March 15, 2024',
  'invoice.date': 'March 1, 2024',
  'invoice.issuedDate': 'March 1, 2024',
  'poolAddress': '123 Main St, Los Angeles, CA 90001',
};

// Available variables list
const availableVariables = [
  '%invoice_number%',
  '%invoiceNumber%',
  '%client.firstName%',
  '%client.lastName%',
  '%client.name%',
  '%company.name%',
  '%invoice.amount%',
  '%invoice.total%',
  '%invoice.dueDate%',
  '%invoice.date%',
  '%invoice.issuedDate%',
  '%poolAddress%',
];

// Function to replace template variables with sample data
const replaceTemplateVariables = (text: string | null | undefined): string => {
  if (!text) return '';
  
  let result = text;
  Object.entries(sampleData).forEach(([key, value]) => {
    const regex = new RegExp(`%${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}%`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
};

export function CommunicationTab() {
  const form = useFormContext<{ communication: InvoiceCommunicationSettings }>();
  const { mutate: updateSettings, isPending } = useUpdateInvoiceSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = form.getValues('communication');
    updateSettings({ type: 'communication', data });
  };

  const invoiceSubject = form.watch('communication.invoiceMessage.subject');
  const invoiceBody = form.watch('communication.invoiceMessage.body');
  const thankYouSubject = form.watch('communication.thankYouMessage.subject');
  const thankYouBody = form.watch('communication.thankYouMessage.body');
  const reminderSubject = form.watch('communication.reminderMessage.subject');
  const reminderBody = form.watch('communication.reminderMessage.body');

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Variables Info Box */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900 font-semibold">Available Variables</AlertTitle>
          <AlertDescription className="text-blue-800 mt-2">
            <p className="mb-2">You can use the following variables in your email templates:</p>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((variable) => (
                <code
                  key={variable}
                  className="px-2 py-1 bg-blue-100 text-blue-900 rounded text-sm font-mono"
                >
                  {variable}
                </code>
              ))}
            </div>
          </AlertDescription>
        </Alert>

        {/* Invoice Message */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Invoice Message</h2>
          <div className="space-y-4">
            <InputField
              name="communication.invoiceMessage.subject"
              label="Email Subject"
              placeholder="Enter email subject"
            />

            <InputField
              name="communication.invoiceMessage.body"
              label="Email Body"
              placeholder="Enter email body"
              type={FieldType.TextArea}
            />

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Example Preview</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Subject:</span> {replaceTemplateVariables(invoiceSubject) || '(No subject)'}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <span className="font-semibold">Body:</span>
                  <div className="mt-1 whitespace-pre-wrap">{replaceTemplateVariables(invoiceBody) || '(No body)'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Thank You Message</h2>
          <div className="space-y-4">
            <InputField
              name="communication.thankYouMessage.subject"
              label="Email Subject"
              placeholder="Enter email subject"
            />

            <InputField
              name="communication.thankYouMessage.body"
              label="Email Body"
              placeholder="Enter email body"
              type={FieldType.TextArea}
            />

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Example Preview</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Subject:</span> {replaceTemplateVariables(thankYouSubject) || '(No subject)'}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <span className="font-semibold">Body:</span>
                  <div className="mt-1 whitespace-pre-wrap">{replaceTemplateVariables(thankYouBody) || '(No body)'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Message */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Reminder Message</h2>
          <div className="space-y-4">
            <InputField
              name="communication.reminderMessage.subject"
              label="Email Subject"
              placeholder="Enter email subject"
            />

            <InputField
              name="communication.reminderMessage.body"
              label="Email Body"
              placeholder="Enter email body"
              type={FieldType.TextArea}
            />

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Example Preview</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Subject:</span> {replaceTemplateVariables(reminderSubject) || '(No subject)'}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <span className="font-semibold">Body:</span>
                  <div className="mt-1 whitespace-pre-wrap">{replaceTemplateVariables(reminderBody) || '(No body)'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Communication Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

