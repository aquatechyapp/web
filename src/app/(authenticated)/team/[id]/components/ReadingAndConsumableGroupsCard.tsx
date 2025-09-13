'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube, Package } from 'lucide-react';

import { Company } from '@/ts/interfaces/Company';
import { ReadingGroupsManager } from './ReadingGroupsManager';
import { ConsumableGroupsManager } from './ConsumableGroupsManager';

interface ReadingAndConsumableGroupsCardProps {
  company: Company;
}

export function ReadingAndConsumableGroupsCard({ company }: ReadingAndConsumableGroupsCardProps) {
  const [activeTab, setActiveTab] = useState('reading');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Service Configuration
        </CardTitle>
        <CardDescription>
          Manage reading groups and consumable groups for your company. These configurations will be used when creating service reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reading" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Reading Groups
            </TabsTrigger>
            <TabsTrigger value="consumable" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Consumable Groups
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reading" className="mt-6">
            <ReadingGroupsManager companyId={company.id} />
          </TabsContent>
          
          <TabsContent value="consumable" className="mt-6">
            <ConsumableGroupsManager companyId={company.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

