'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { MetricCard } from './_components/MetricCard';
import { TableCard } from './_components/TableCard';
import ActionButton from './_components/ActionButton';
import StatisticCard from './_components/StatisticCard';

// Temporary mock data - replace with API calls later
const mockData = {
  monthlyRevenue: 45000,
  averageRevenuePerPool: 250,
  companyValueMin: 800000,
  companyValueMax: 1200000,
  churnRate: 2.5,
  lateFilters: [
    { name: 'Smith Family Pool', value: '2 days overdue' },
    { name: 'Johnson Residence', value: '1 day overdue' },
    { name: 'Williams Estate', value: '3 days overdue' },
    { name: 'Brown Family Pool', value: '1 day overdue' },
    { name: 'Davis Residence', value: '2 days overdue' },
  ],
  recentReports: [
    { name: 'Smith Family', value: 'High chlorine levels detected' },
    { name: 'Johnson Residence', value: 'Pump maintenance required' },
    { name: 'Williams Estate', value: 'Filter cleaning overdue' },
    { name: 'Brown Family', value: 'Water balance needed' },
    { name: 'Davis Residence', value: 'Equipment inspection due' },
  ],
  topCities: [
    { name: 'Miami', value: '45 pools' },
    { name: 'Fort Lauderdale', value: '32 pools' },
    { name: 'Boca Raton', value: '28 pools' },
    { name: 'West Palm Beach', value: '25 pools' },
    { name: 'Pompano Beach', value: '20 pools' },
  ],
};

const formatMonthlyPayment = (payment: string | number | undefined) => {
  if (payment === undefined) return 'US$ 0.00';
  const amount = typeof payment === 'string' ? parseFloat(payment.replace(/\D/g, '')) : payment;
  return `US$ ${(amount / 100).toFixed(2)}`;
};

export default function Page() {
  const [ showConfidential, setShowConfidential ] = useState(false);
  const { data: allClients, isLoading: isLoadingAllClients } = useGetAllClients();
  const { width = 0 } = useWindowDimensions();

  if (isLoadingAllClients) return <LoadingSpinner />;

  const totalClientsCount = allClients?.length || 0;

  const toggleConfidential = () => setShowConfidential(!showConfidential);

  if (width < 1024) {
    return (
      <div className="p-2">
        <div className="flex w-full flex-col gap-6 text-nowrap">
          <ActionButton type="add_client" />
          <ActionButton type="route_dashboard" />
          <ActionButton type="my_team" />
          <StatisticCard value={totalClientsCount} type="clients" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* First Row - Financial Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <MetricCard
          title="Monthly Revenue & Average per Pool"
          value={formatMonthlyPayment(mockData.monthlyRevenue)}
          subValue={`${formatMonthlyPayment(mockData.averageRevenuePerPool)} per pool`}
          isBlurred={!showConfidential}
          showEyeIcon
          onToggleBlur={toggleConfidential}
          trend={{ value: 8.2, isPositive: true }}
        />
        <MetricCard
          title="Estimated Company Value"
          value={`${formatMonthlyPayment(mockData.companyValueMin)} - ${formatMonthlyPayment(mockData.companyValueMax)}`}
          isBlurred={!showConfidential}
          showEyeIcon
          onToggleBlur={toggleConfidential}
          trend={{ value: 12.5, isPositive: true }}
        />
      </div>

      {/* Second Row - Operational Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          title="Total Clients"
          value={totalClientsCount}
          trend={{ value: 5.3, isPositive: true }}
        />
       
        <MetricCard
          title="Churn Rate"
          value={`${mockData.churnRate}%`}
          trend={{ value: 0.5, isPositive: false }}
        />
      </div>

      {/* Separator */}
      <div className="mb-8 h-1 w-full bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 rounded-full" />

      {/* Third Row - Detailed Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TableCard
          title="Top 5 late filters"
          items={mockData.lateFilters}
        />
        <TableCard
          title="Recent issues"
          items={mockData.recentReports}
        />
        <TableCard
          title="Top cities by pool count"
          items={mockData.topCities}
        />
      </div>
    </div>
  );
}
