'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/InputField';
import { AddressInput } from '@/components/AddressInput';
import { FieldType, IanaTimeZones } from '@/ts/enums/enums';
import { Company } from '@/ts/interfaces/Company';
import { useUpdateInvoiceSettings, InvoiceCompanyInformation } from '@/hooks/react-query/invoices/useUpdateInvoiceSettings';

interface CompanyInformationTabProps {
  company: Company | null;
}

export function CompanyInformationTab({ company }: CompanyInformationTabProps) {
  const form = useFormContext<{ company: InvoiceCompanyInformation }>();
  const { mutate: updateSettings, isPending } = useUpdateInvoiceSettings();

  const handleAddressSelect = (address: {
    fullAddress: string;
    state: string;
    city: string;
    zipCode: string;
    timezone: IanaTimeZones;
  }) => {
    form.setValue('company.address', address.fullAddress);
    form.setValue('company.state', address.state);
    form.setValue('company.city', address.city);
    form.setValue('company.zip', address.zipCode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = form.getValues('company');
    updateSettings({ type: 'company', data });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Company Information</h2>
          <div className="space-y-4">
            <InputField
              name="company.name"
              label="Company Name"
              placeholder="Enter company name"
              disabled
            />

            <div className="flex flex-col gap-4 md:flex-row md:flex-nowrap w-full [&>*]:flex-1">
              <AddressInput
                name="company.address"
                label="Address"
                placeholder="Enter company address"
                onAddressSelect={handleAddressSelect}
                disabled
              />
              <InputField name="company.state" label="State" placeholder="State" disabled />
              <InputField name="company.city" label="City" placeholder="City" disabled />
              <InputField name="company.zip" label="Zip code" placeholder="Zip code" disabled />
            </div>

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

