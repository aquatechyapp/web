'use client';

import { UserPlus, ArrowLeft, Calendar, MapPin, Clock, ArrowRight, Table } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetTechnicianSummary } from '@/hooks/react-query/reports/useGetTechnicianSummary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function TechniciansPage() {
  const { data: technicians, isLoading, error } = useGetTechnicianSummary();

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
          <p className="text-red-600">Error loading technician data</p>
        </div>
      </div>
    );
  }

  if (!technicians || technicians.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/reports/team">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team Reports
              </Button>
          </Link>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-[#364D9D]" />
            Individual Technician Performance
          </h1>
          <p className="text-gray-600 mt-2">
            Detailed filter cleaning performance for each technician
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No technician data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/reports/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team Reports
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-[#364D9D]" />
          Individual Technician Performance
        </h1>
        <p className="text-gray-600 mt-2">
          Detailed filter cleaning performance for each technician
        </p>
      </div>

      <div className="space-y-6">
        {technicians.map((tech) => (
          <Card key={tech.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {tech.name}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#364D9D]">{tech.onTimePercentage}%</div>
                  <div className="text-sm text-gray-600">On-time rate</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 justify-between">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#364D9D]">{tech.pools}</div>
                  <div className="text-sm text-gray-600">Pools Assigned</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((tech.onTimePercentage / 100) * tech.pools)}
                  </div>
                  <div className="text-sm text-gray-600">On-Time Cleanings</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{tech.overdueCount}</div>
                  <div className="text-sm text-gray-600">Overdue Cleanings</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <Link href={`/reports/team/technicians/${tech.id}/details`}>
                  <Button variant="outline" className="w-full">
                    <Table className="h-4 w-4 mr-2" />
                    View Filter Cleaning Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 