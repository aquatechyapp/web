'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube, Package, Camera, CheckSquare, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Company } from '@/ts/interfaces/Company';
import { ReadingGroupsManager } from './ReadingGroups/ReadingGroupsManager';
import { ConsumableGroupsManager } from './ConsumableGroups/ConsumableGroupsManager';
import { PhotoGroupsManager } from './PhotoGroups/PhotoGroupsManager';
import { SelectorGroupsManager } from './SelectorGroups/SelectorGroupsManager';

interface ReadingAndConsumableGroupsCardProps {
  company: Company;
}

export function ReadingAndConsumableGroupsCard({ company }: ReadingAndConsumableGroupsCardProps) {
  const [activeTab, setActiveTab] = useState('reading');
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Card className="w-full border-2 border-orange-200">
      <CardHeader
        className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 cursor-pointer hover:from-orange-100 hover:to-amber-100 transition-colors"
        onClick={toggleCollapsed}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TestTube className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-orange-900">Service Configuration</CardTitle>
              <CardDescription className="text-orange-700">
                Manage reading groups, consumable groups, photo groups, and selector groups for your company. These configurations will be used when creating new services.
              </CardDescription>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-orange-600 transition-transform duration-200",
              collapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </CardHeader>
      {!collapsed && (
        <CardContent className="px-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className="
      flex flex-wrap justify-start gap-2
      w-full bg-orange-100 border border-orange-200 h-auto
    "
            >
              <TabsTrigger
                value="reading"
                className="flex-1 min-w-[45%] sm:min-w-0 flex items-center justify-center gap-2 text-sm
        data-[state=active]:bg-orange-600 data-[state=active]:text-white
        data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:text-orange-800
        data-[state=inactive]:hover:bg-orange-200 rounded-md px-2 py-2 transition-colors"
              >
                <TestTube className="h-4 w-4" />
                Reading
              </TabsTrigger>

              <TabsTrigger
                value="consumable"
                className="flex-1 min-w-[45%] sm:min-w-0 flex items-center justify-center gap-2 text-sm
        data-[state=active]:bg-orange-600 data-[state=active]:text-white
        data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:text-orange-800
        data-[state=inactive]:hover:bg-orange-200 rounded-md px-2 py-2 transition-colors"
              >
                <Package className="h-4 w-4" />
                Consumables
              </TabsTrigger>

              <TabsTrigger
                value="photo"
                className="flex-1 min-w-[45%] sm:min-w-0 flex items-center justify-center gap-2 text-sm
        data-[state=active]:bg-orange-600 data-[state=active]:text-white
        data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:text-orange-800
        data-[state=inactive]:hover:bg-orange-200 rounded-md px-2 py-2 transition-colors"
              >
                <Camera className="h-4 w-4" />
                Photos
              </TabsTrigger>

              <TabsTrigger
                value="selector"
                className="flex-1 min-w-[45%] sm:min-w-0 flex items-center justify-center gap-2 text-sm
        data-[state=active]:bg-orange-600 data-[state=active]:text-white
        data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:text-orange-800
        data-[state=inactive]:hover:bg-orange-200 rounded-md px-2 py-2 transition-colors"
              >
                <CheckSquare className="h-4 w-4" />
                Selectors
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 w-full relative">
              <TabsContent value="reading" className="mt-6 px-4 w-full">
                <ReadingGroupsManager companyId={company.id} />
              </TabsContent>

              <TabsContent value="consumable" className="mt-6 px-4 w-full">
                <ConsumableGroupsManager companyId={company.id} />
              </TabsContent>

              <TabsContent value="photo" className="mt-6 px-4 w-full">
                <PhotoGroupsManager companyId={company.id} />
              </TabsContent>

              <TabsContent value="selector" className="mt-6 px-4 w-full">
                <SelectorGroupsManager companyId={company.id} />
              </TabsContent>
            </div>
          </Tabs>

        </CardContent>
      )}
    </Card>
  );
}

