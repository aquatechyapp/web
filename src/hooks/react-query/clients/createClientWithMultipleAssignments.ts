import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { clientAxios } from '@/lib/clientAxios';
import { createFormData } from '@/utils/formUtils';
import { useToast } from '@/components/ui/use-toast';
import { Frequency } from '@/ts/enums/enums';

// Update the Assignment interface to match the form schema
export interface Assignment {
  assignmentToId: string;
  serviceTypeId: string;
  weekday: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  frequency: Frequency;
  startOn: string;
  endAfter: string;
}

// Define the client creation data type with assignments array
export interface CreateClientWithAssignmentsData {
  // Client data
  companyOwnerId: string;
  firstName: string;
  lastName: string;
  clientCompany?: string;
  customerCode?: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  clientType: 'Commercial' | 'Residential';
  timezone: string;
  phone: string;
  email: string;
  secondaryEmail?: string;
  invoiceEmail?: string;
  clientNotes?: string;
  
  // Pool data
  sameBillingAddress: boolean;
  animalDanger: boolean;
  poolAddress?: string;
  poolState?: string;
  poolCity?: string;
  poolZip?: string;
  monthlyPayment?: number;
  lockerCode?: string;
  enterSide?: string;
  poolType?: string;
  poolNotes?: string;
  
  // Assignments array
  assignments: Assignment[];
}

export const useCreateClientWithMultipleAssignments = (options?: { redirectTo?: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateClientWithAssignmentsData) => {
      // Stringify the assignments array
      const formData = {
        ...data,
        assignments: JSON.stringify(data.assignments)
      };
      
      return await clientAxios.post('/client-pool-assignment', createFormData(formData), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      router.push(options?.redirectTo || '/clients');
      toast({
        duration: 5000,
        title: 'Client added successfully',
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      console.log(error);
      toast({
        duration: 5000,
        title: 'Error adding client',
        variant: 'error',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
}; 