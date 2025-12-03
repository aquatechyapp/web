import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';

import { clientAxios } from '../../../lib/clientAxios';

export interface InvoiceCompanyInformation {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  replyToEmail: string;
}

export interface InvoiceDefaultValues {
  paymentInstructions: string;
  notes: string;
  frequency: 'weekly' | 'monthly' | 'yearly';
  paymentTerm: string; // Number of days as string: '1', '3', '7', '15', '30', '60'
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface InvoiceCommunicationSettings {
  invoiceMessage: EmailTemplate;
  thankYouMessage: EmailTemplate;
  reminderMessage: EmailTemplate;
}

export type InvoiceSettingsData =
  | { type: 'company'; data: InvoiceCompanyInformation }
  | { type: 'defaults'; data: InvoiceDefaultValues }
  | { type: 'communication'; data: InvoiceCommunicationSettings };

type ErrorResponse = {
  message: string;
};

export const useUpdateInvoiceSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settingsData: InvoiceSettingsData) => {
      // TODO: Implement backend API endpoint
      // Example: await clientAxios.patch('/invoices/settings', settingsData);
      
      // For now, return a mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: settingsData });
        }, 500);
      });
    },
    onSuccess: (response, variables) => {
      // TODO: Update cache when backend is implemented
      // queryClient.setQueryData(['invoice-settings'], response.data);

      toast({
        title: 'Settings updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log('error', error);
      toast({
        title: 'Error updating settings',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

