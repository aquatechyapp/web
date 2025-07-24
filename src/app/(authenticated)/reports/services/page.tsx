'use client';

import { ListChecks, FileBarChartIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ServiceReportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-green-600" />
          Service Reports
        </h1>
        <p className="text-gray-600 mt-2">
          Generate reports on service completion, technician performance, and operational efficiency
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileBarChartIcon className="h-5 w-5 text-blue-600" />
                Technician Performance Report
              </CardTitle>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Coming Soon
              </Badge>
            </div>
            <CardDescription>
              Track technician efficiency and service quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Monitor service completion rates, time efficiency, and chemical usage per technician.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileBarChartIcon className="h-5 w-5 text-green-600" />
                Service Completion Summary
              </CardTitle>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Coming Soon
              </Badge>
            </div>
            <CardDescription>
              Daily, weekly, and monthly service completion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Track service completion rates and identify trends over time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileBarChartIcon className="h-5 w-5 text-purple-600" />
                Chemical Usage Report
              </CardTitle>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Coming Soon
              </Badge>
            </div>
            <CardDescription>
              Monitor chemical consumption and costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Track chlorine, tablets, phosphate, and acid usage across all services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileBarChartIcon className="h-5 w-5 text-orange-600" />
                Route Efficiency Report
              </CardTitle>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Coming Soon
              </Badge>
            </div>
            <CardDescription>
              Optimize routes and service scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Analyze time spent per route and identify optimization opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 