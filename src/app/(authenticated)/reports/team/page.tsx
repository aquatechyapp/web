'use client';

import { UserPlus, FileBarChartIcon, Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetTechnicianSummary } from '@/hooks/react-query/reports/useGetTechnicianSummary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function TeamReportsPage() {
  const { data: technicians, isLoading, error } = useGetTechnicianSummary();

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceText = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    return 'Needs Improvement';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">Error loading team data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-purple-600" />
          Team Filter Cleaning Reports
        </h1>
        <p className="text-gray-600 mt-2">
          Track filter cleaning punctuality and compliance for each technician
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileBarChartIcon className="h-5 w-5 text-green-600" />
                Individual Technician Performance
              </CardTitle>
            </div>
            <CardDescription>
              Filter cleaning punctuality by technician
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {!technicians || technicians.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No technician data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {technicians.slice(0, 3).map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-gray-600">{tech.pools} pools assigned</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getPerformanceColor(tech.onTimePercentage)}`}>
                        {tech.onTimePercentage}% on-time
                      </p>
                      <p className="text-xs text-gray-500">
                        {tech.overdueCount} overdue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/reports/team/technicians">
              <Button variant="outline" className="w-full">
                View All Technicians
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
} 