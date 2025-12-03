'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/store/user';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { Company } from '@/ts/interfaces/Company';

import { CompanyInformationTab } from './components/CompanyInformationTab';
import { DefaultValuesTab } from './components/DefaultValuesTab';
import { CommunicationTab } from './components/CommunicationTab';
import { OnlinePaymentsTab } from './components/OnlinePaymentsTab';
import {
  InvoiceCompanyInformation,
  InvoiceDefaultValues,
  InvoiceCommunicationSettings
} from '@/hooks/react-query/invoices/useUpdateInvoiceSettings';

interface InvoiceSettingsFormData {
  company: InvoiceCompanyInformation;
  defaults: InvoiceDefaultValues;
  communication: InvoiceCommunicationSettings;
}

const defaultPaymentInstructions = 'Please make payment via check or bank transfer. Contact us for bank details.';
const defaultNotes = 'Thank you for your business!';

export default function InvoiceSettingsPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: companies = [], isLoading: isLoadingCompanies } = useGetCompanies();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Get the first company (or user's company if available)
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, selectedCompany]);

  const form = useForm<InvoiceSettingsFormData>({
    defaultValues: {
      company: {
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        replyToEmail: ''
      },
      defaults: {
        paymentInstructions: defaultPaymentInstructions,
        notes: defaultNotes,
        frequency: 'monthly',
        paymentTerm: '30'
      },
      communication: {
        invoiceMessage: {
          subject: 'Invoice %invoice_number%',
          body: 'Please find attached invoice %invoice_number% for your review.'
        },
        thankYouMessage: {
          subject: 'Thank you for your payment',
          body: 'We have received your payment. Thank you for your business!'
        },
        reminderMessage: {
          subject: 'Payment reminder for invoice %invoice_number%',
          body: 'This is a friendly reminder that invoice %invoice_number% is due. Please make payment at your earliest convenience.'
        }
      }
    }
  });

  // Update form when company data is available
  useEffect(() => {
    if (selectedCompany) {
      form.setValue('company.name', selectedCompany.name || '');
      form.setValue('company.address', selectedCompany.address || '');
      form.setValue('company.city', selectedCompany.city || '');
      form.setValue('company.state', selectedCompany.state || '');
      form.setValue('company.zip', selectedCompany.zip || '');
      form.setValue('company.replyToEmail', selectedCompany.email || '');
    }
  }, [selectedCompany, form]);

  // Auth check
  useEffect(() => {
    if (user.firstName === '') {
      router.push('/onboarding');
    }
  }, [user, router]);

  if (isLoadingCompanies) {
    return <LoadingSpinner />;
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-6 p-2">
        <h1 className="text-2xl font-bold">Invoice Settings</h1>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500">
            <TabsTrigger
              value="company"
              className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow"
            >
              Company Information
            </TabsTrigger>
            <TabsTrigger
              value="defaults"
              className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow"
            >
              Default Values
            </TabsTrigger>
            <TabsTrigger
              value="communication"
              className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow"
            >
              Communication
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow"
            >
              Online Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-6">
            <CompanyInformationTab company={selectedCompany} />
          </TabsContent>

          <TabsContent value="defaults" className="mt-6">
            <DefaultValuesTab />
          </TabsContent>

          <TabsContent value="communication" className="mt-6">
            <CommunicationTab />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <OnlinePaymentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </FormProvider>
  );
}
