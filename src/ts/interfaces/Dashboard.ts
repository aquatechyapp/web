export interface Dashboard {
  revenue: {
    monthly: number;
    averagePerPool: number;
  };
  companyValue: {
    min: number;
    max: number;
  };
  clients: {
    total: number;
  };
  churnRate: {
    value: number;
    change: number;
  };
  lateFilters: Array<{
    name: string;
    daysOverdue: number;
  }>;
  recentIssues: Array<{
    clientName: string;
    issue: string;
    createdAt: Date;
    id: string;
  }>;
  topCities: Array<{
    city: string;
    poolCount: number;
  }>;
}
