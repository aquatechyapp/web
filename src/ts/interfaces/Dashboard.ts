export interface Dashboard {
  recentIssues: Array<{
    id: string;
    client: string; 
    date: Date; 
    technician: string;
    description: string;
  }>;
  filterCleaningPunctuality: Array<{
    id: string;
    technician: string;
    onTimePercentage: number;
    overdueCount: number;
    assignedPools: number;
  }>;
  poolsWithoutAssignment: Array<{
    id: string;
    clientName: string;
    poolName: string;
    address: string;
  }>;
}
