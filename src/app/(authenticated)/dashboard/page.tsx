'use client';

import { useState } from 'react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { MetricCard } from './_components/MetricCard';
import { TableCard } from './_components/TableCard';

import { useUserStore } from '@/store/user';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';


const formatMonthlyPayment = (payment: string | number | undefined) => {
  if (payment === undefined) return 'US$ 0.00';
  const amount = typeof payment === 'string' ? parseFloat(payment.replace(/\D/g, '')) : payment;
  return `US$ ${(amount / 100).toFixed(2)}`;
};

export default function Page() {
  const [ showConfidential, setShowConfidential ] = useState(false);
  const { dashboard } = useUserStore((state) => state);
  const { width = 0 } = useWindowDimensions();
  const router = useRouter();
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
          items={lateFilters.map((filter) => ({ name: filter.name, value: `${filter.daysOverdue} days overdue`,}))}
        />
        <TableCard
          title="Recent reports"
          items={recentIssues.map((issue) => ({ 
            name: issue.clientName, 
            value: issue.issue, 
            thirdColumn: format(new Date(issue.createdAt), 'MMMM do') // This will show "July 21st"
          }))}
          columns={3}
          columnLabels={{
            first: 'Client',
            second: 'Description',
            third: 'Date'
          }}
        />
        <TableCard
          title="Top cities by pool count"
          items={topCities.map((city) => ({ name: city.city, value: city.poolCount }))}
        />
      </div>
    </div>
  );
}
