'use client';

import { useState } from 'react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { MetricCard } from './_components/MetricCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
  const { filterCleaningPunctuality, poolsWithoutAssignment, recentIssues } = dashboard;

  const toggleConfidential = () => setShowConfidential(!showConfidential);

  if (width < 1024) {
    return (
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Separator */}
      <div className="mb-8 h-1 w-full bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 rounded-full" />

      {/* Recent Issues Table */}
      <div className="mb-8">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Pending Issues</h2>
            <Button 
              onClick={() => router.push('/requests')}
              className="flex items-center gap-2"
            >
              View All Requests
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Technician</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {recentIssues?.map((issue) => (
                  <tr key={issue.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900 font-medium">{issue.client}</td>
                    <td className="py-3 px-4 text-gray-600 flex">{format(new Date(issue.date), 'MMM dd, yyyy hh:mma')}</td>
                    <td className="py-3 px-4 text-gray-600">{issue.technician}</td>
                    <td className="py-3 px-4 text-gray-600">{issue.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filter Cleaning Punctuality Section */}
      <div className="mb-8">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Filter Cleaning Punctuality</h2>
            <Button 
              onClick={() => router.push('/reports/team')}
              className="flex items-center gap-2"
            >
              View Reports
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Technician</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">On Time %</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Overdue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned Pools</th>
                </tr>
              </thead>
              <tbody>
                {filterCleaningPunctuality?.map((tech) => (
                  <tr key={tech.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900 font-medium">{tech.technician}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          tech.onTimePercentage >= 90 ? 'text-green-600' : 
                          tech.onTimePercentage >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {tech.onTimePercentage}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              tech.onTimePercentage >= 90 ? 'bg-green-500' : 
                              tech.onTimePercentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${tech.onTimePercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tech.overdueCount === 0 ? 'bg-green-100 text-green-800' :
                        tech.overdueCount <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tech.overdueCount} overdue
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{tech.assignedPools} pools</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pools Without Assignment Section */}
      <div className="mb-8">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Pools Without Assignment</h2>
            <Button 
              onClick={() => router.push('/clients')}
              className="flex items-center gap-2"
            >
              View All Clients
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Client Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Pool Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Address</th>
                </tr>
              </thead>
              <tbody>
                {poolsWithoutAssignment?.map((pool) => (
                  <tr key={pool.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900 font-medium">{pool.clientName}</td>
                    <td className="py-3 px-4 text-gray-600">{pool.poolName}</td>
                    <td className="py-3 px-4 text-gray-600">{pool.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
