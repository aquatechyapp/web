'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { MetricCard } from './_components/MetricCard';
import { TableCard } from './_components/TableCard';
import ActionButton from './_components/ActionButton';
import StatisticCard from './_components/StatisticCard';
import { useUserStore } from '@/store/user';

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
  const { dashboard } = useUserStore((state) => state);
  const { width = 0 } = useWindowDimensions();

  const { churnRate, clients, companyValue, revenue, lateFilters, recentIssues, topCities } = dashboard;

  const toggleConfidential = () => setShowConfidential(!showConfidential);

  if (width < 1024) {
    return (
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <MetricCard
              title="Total Clients"
              value={dashboard.clients.total.toString()}
              icon="clients"
            />
            <MetricCard
              title="Total Monthly Revenue"
              value={formatMonthlyPayment(dashboard.revenue.monthly)}
              showEyeIcon={true}
              isBlurred={!showConfidential}
              onToggleBlur={toggleConfidential}
              icon="revenue"
            />
            <MetricCard
              title="Average Revenue per Pool"
              value={formatMonthlyPayment(dashboard.revenue.averagePerPool)}
              subValue="Monthly average"
              showEyeIcon={true}
              isBlurred={!showConfidential}
              onToggleBlur={toggleConfidential}
              icon="revenue"
            />
            <MetricCard
              title="Company Value"
              value={`${formatMonthlyPayment(dashboard.companyValue.min)} - ${formatMonthlyPayment(dashboard.companyValue.max)}`}
              showEyeIcon={true}
              isBlurred={!showConfidential}
              onToggleBlur={toggleConfidential}
              icon="company"
            />
            
            
            <MetricCard
              title="Churn Rate"
              value={`${dashboard.churnRate.value}%`}
            />
          </div>
          <div className="flex flex-col gap-4">
            <TableCard
              title="Late Filters"
              items={dashboard.lateFilters.map(filter => ({
                name: filter.name,
                value: `${filter.daysOverdue} days`
              }))}
            />
            <TableCard
              title="Recent Issues"
              items={dashboard.recentIssues.map(issue => ({
                name: issue.clientName,
                value: issue.issue
              }))}
            />
            <TableCard
              title="Top Cities"
              items={dashboard.topCities.map(city => ({
                name: city.city,
                value: `${city.poolCount} pools`
              }))}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* First Row - Financial Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          title="Total Clients"
          value={clients.total}
        />
        <MetricCard
          title="Monthly Revenue & Average per Pool"
          value={formatMonthlyPayment(revenue.monthly)}
          subValue={`${formatMonthlyPayment(revenue.averagePerPool)} per pool`}
          isBlurred={!showConfidential}
          showEyeIcon
          onToggleBlur={toggleConfidential}
        />
        <MetricCard
          title="Estimated Company Value"
          value={`${formatMonthlyPayment(companyValue.min)} - ${formatMonthlyPayment(companyValue.max)}`}
          isBlurred={!showConfidential}
          showEyeIcon
          onToggleBlur={toggleConfidential}
        />
      </div>

      {/* Separator */}
      <div className="mb-8 h-1 w-full bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 rounded-full" />

      {/* Third Row - Detailed Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TableCard
          title="Top 5 late filters"
          items={lateFilters.map((filter) => ({ name: filter.name, value: `${filter.daysOverdue} days overdue` }))}
        />
        <TableCard
          title="Recent issues"
          items={recentIssues.map((issue) => ({ name: issue.clientName, value: issue.issue }))}
        />
        <TableCard
          title="Top cities by pool count"
          items={topCities.map((city) => ({ name: city.city, value: city.poolCount }))}
        />
      </div>
    </div>
  );
}
