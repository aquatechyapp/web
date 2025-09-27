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
            <TabsList className="grid w-full grid-cols-4 bg-orange-100 border border-orange-200">
              <TabsTrigger 
                value="reading" 
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:text-orange-800 data-[state=inactive]:hover:bg-orange-200"
              >
                <TestTube className="h-4 w-4" />
                Reading Groups
              </TabsTrigger>
              <TabsTrigger 
                value="consumable" 
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:text-orange-800 data-[state=inactive]:hover:bg-orange-200"
              >
                <Package className="h-4 w-4" />
                Consumable Groups
              </TabsTrigger>
              <TabsTrigger 
                value="photo" 
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:text-orange-800 data-[state=inactive]:hover:bg-orange-200"
              >
                <Camera className="h-4 w-4" />
                Photo Groups
              </TabsTrigger>
              <TabsTrigger 
                value="selector" 
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=inactive]:text-orange-700 data-[state=inactive]:hover:text-orange-800 data-[state=inactive]:hover:bg-orange-200"
              >
                <CheckSquare className="h-4 w-4" />
                Selector Groups
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reading" className="mt-6 px-6">
              <ReadingGroupsManager companyId={company.id} />
            </TabsContent>
            
            <TabsContent value="consumable" className="mt-6 px-6">
              <ConsumableGroupsManager companyId={company.id} />
            </TabsContent>
            
            <TabsContent value="photo" className="mt-6 px-6">
              <PhotoGroupsManager companyId={company.id} />
            </TabsContent>
            
            <TabsContent value="selector" className="mt-6 px-6">
              <SelectorGroupsManager companyId={company.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}

