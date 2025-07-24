import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';

interface AssignmentTo {
  firstName: string;
  lastName: string;
  id: string;
}

interface TechnicianPerformanceData {
  clientName: string;
  poolName: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  lastCleaningDate: string;
  nextCleaningDate: string;
  overdueDays: number;
  status: string;
  assignmentTo: AssignmentTo;
}

interface TechnicianPerformanceResponse {
  data: {
    report: TechnicianPerformanceData[];
  };
}

export const useGetTechnicianPerformance = () => {
  return useQuery({
    queryKey: ['technician-performance'],
    queryFn: async (): Promise<TechnicianPerformanceResponse> => {
      const response = await clientAxios.get('/reports/team/individual-technician-performance');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 