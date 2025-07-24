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
  lastCleaningDate: string | null;
  nextCleaningDate: string | null;
  overdueDays: number;
  status: string;
  assignmentTo: AssignmentTo;
}

interface TechnicianSummary {
  id: string;
  name: string;
  pools: number;
  onTimePercentage: number;
  overdueCount: number;
  status: string;
}

export const useGetTechnicianSummary = () => {
  return useQuery({
    queryKey: ['technician-summary'],
    queryFn: async (): Promise<TechnicianSummary[]> => {
      const response = await clientAxios.get('/reports/team/individual-technician-performance');
      const data = response.data.data.report;
      
      // Group data by technician and calculate summary
      const technicianMap = new Map<string, TechnicianSummary>();
      
      data.forEach((item: TechnicianPerformanceData) => {
        const techId = item.assignmentTo.id;
        const techName = `${item.assignmentTo.firstName} ${item.assignmentTo.lastName}`;
        
        if (!technicianMap.has(techId)) {
          technicianMap.set(techId, {
            id: techId,
            name: techName,
            pools: 0,
            onTimePercentage: 0,
            overdueCount: 0,
            status: 'active'
          });
        }
        
        const tech = technicianMap.get(techId)!;
        tech.pools++;
        
        const status = item.status.toLowerCase();
        
        // Count null lastCleaningDate as overdue
        if (item.lastCleaningDate === null) {
          tech.overdueCount++;
        } else if (status === 'on time' || status === 'ontime') {
          // Count as on-time
        } else if (status === 'overdue') {
          tech.overdueCount++;
        }
        // Remove late category - everything else counts as overdue
        else {
          tech.overdueCount++;
        }
      });
      
      // Calculate percentages
      technicianMap.forEach((tech) => {
        const totalCleanings = tech.pools;
        const onTimeCleanings = totalCleanings - tech.overdueCount;
        tech.onTimePercentage = totalCleanings > 0 ? Math.round((onTimeCleanings / totalCleanings) * 100) : 0;
      });
      
      return Array.from(technicianMap.values());
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 