'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Company } from '@/ts/interfaces/Company';
import { ChecklistTemplatesManager } from './ChecklistTemplatesManager';

interface ChecklistTemplatesCardProps {
  company: Company;
}

export function ChecklistTemplatesCard({ company }: ChecklistTemplatesCardProps) {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Card className="w-full border-2 border-purple-200">
      <CardHeader
        className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200 cursor-pointer hover:from-purple-100 hover:to-violet-100 transition-colors"
        onClick={toggleCollapsed}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-purple-900">Checklist Templates</CardTitle>
              <CardDescription className="text-purple-700">
                Manage checklist templates for your service reports. Create different templates for different service types or specific pools.
              </CardDescription>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-purple-600 transition-transform duration-200",
              collapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </CardHeader>
      {!collapsed && (
        <CardContent className="p-6">
          <ChecklistTemplatesManager companyId={company.id} />
        </CardContent>
      )}
    </Card>
  );
}
