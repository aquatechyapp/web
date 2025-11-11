import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';

import { clientAxios } from '@/lib/clientAxios';
import { generateTechnicianReportPDF } from '@/utils/generateTechnicianReportPDF';

// Updated to handle service types with flexible payment calculation methods

interface ServiceTypeWithPayment {
  serviceTypeId: string;
  serviceTypeName: string;
  calculateMethod: "amount" | "percentage";
  paymentAmountPerService?: number; // Required when calculateMethod is 'amount'
  paymentPercentagePerService?: number; // Required when calculateMethod is 'percentage'
}

interface GenerateTechnicianReportParams {
    assignedToId: string;
    companyId: string;
    serviceTypes: ServiceTypeWithPayment[];
    fromDate: string;
    toDate: string;
}

export const useGenerateTechnicianReport = () => {
  return useMutation({
    mutationFn: async ({ assignedToId, companyId, serviceTypes, fromDate, toDate }: GenerateTechnicianReportParams) => {
      const params: any = {
        from: fromDate,
        to: toDate,
        assignedToId,
        companyId: companyId,
        format: 'json'
      };

      // Get JSON data from backend
      const response = await clientAxios.post('/services/reports', serviceTypes, { params });

      // Generate PDF from JSON data
      await generateTechnicianReportPDF(
        response.data,
        fromDate,
        toDate
      );

      return response.data;
    },
    onError: (error) => {
      console.error('Error generating technician report:', error);
      throw new Error('Failed to generate report. Please try again.');
    }
  });
};
