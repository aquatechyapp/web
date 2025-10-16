import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';

import { clientAxios } from '@/lib/clientAxios';
import { generateTechnicianReportPDF } from '@/utils/generateTechnicianReportPDF';

interface GenerateTechnicianReportParams {
    assignedToId: string;
    companyId: string;
  serviceTypeId: string;
    fromDate: string;
    toDate: string;
}

export const useGenerateTechnicianReport = () => {
  return useMutation({
    mutationFn: async ({ assignedToId, companyId, serviceTypeId, fromDate, toDate }: GenerateTechnicianReportParams) => {
      const params: any = {
        from: fromDate,
        to: toDate,
        assignedToId,
        companyId: companyId,
        serviceTypeId: serviceTypeId,
        format: 'json'
      };

      // Get JSON data from backend
      const response = await clientAxios.get('/services/reports', { params });

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
