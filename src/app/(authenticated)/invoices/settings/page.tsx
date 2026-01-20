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
  InvoiceCommunication
} from '@/ts/interfaces/Company';

interface InvoiceSettingsFormData {
  company: InvoiceCompanyInformation;
  defaults: InvoiceDefaultValues;
  communication: InvoiceCommunication;
}

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
        replyToEmail: null
      },
      defaults: {
        paymentInstructions: null,
        notes: null,
        defaultFrequency: null,
        defaultPaymentTerm: null
      },
      communication: {
        invoiceMessage: null,
        thankYouMessage: null,
        reminderMessage: null
      }
    }
  });

  // Note: Form values are loaded by individual tab components to ensure fresh data
  // when switching tabs or companies. This prevents stale data issues.

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
            <CompanyInformationTab companyId={selectedCompany?.id} />
          </TabsContent>

          <TabsContent value="defaults" className="mt-6">
            <DefaultValuesTab companyId={selectedCompany?.id} />
          </TabsContent>

          <TabsContent value="communication" className="mt-6">
            <CommunicationTab companyId={selectedCompany?.id} />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <OnlinePaymentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </FormProvider>
  );
}
