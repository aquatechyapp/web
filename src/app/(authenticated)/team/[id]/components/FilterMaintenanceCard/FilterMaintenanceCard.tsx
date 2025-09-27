'use client';

import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Filter, ChevronDown } from 'lucide-react';

import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';
import { useUpdateCompanyPreferences } from '@/hooks/react-query/companies/updatePreferences';
import { Company } from '@/ts/interfaces/Company';

interface FilterMaintenanceCardProps {
  company: Company;
  form: any;
  onFilterSubmit: (data: any) => void;
  filterFieldsChanged: () => boolean;
}

const filterFields = [
  {
    description: 'Set the interval in days for filter cleaning maintenance.',
    itens: [
      {
        label: 'days',
        description: 'Number of days between filter cleanings',
        name: 'filterCleaningIntervalDays',
        type: FieldType.Number
      }
    ],
    label: 'Filter Cleaning Interval',
    type: FieldType.Number
  },
  {
    description: 'Set the interval in days for filter replacement.',
    itens: [
      {
        label: 'days',
        description: 'Number of days between filter replacements',
        name: 'filterReplacementIntervalDays',
        type: FieldType.Number
      }
    ],
    label: 'Filter Replacement Interval',
    type: FieldType.Number
  },
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Require technicians to take photos when cleaning or replacing filters.',
    label: 'Filter Maintenance Photos',
    itens: [
      {
        label: 'Require photo to every filter cleaned or replaced',
        description: 'Technicians must take photos when cleaning or replacing filters',
        name: 'filterCleaningMustHavePhotos'
      }
    ]
  },
  {
    inputClassName: 'flex justify-center items-center gap-4',
    type: FieldType.Switch,
    description: 'Send e-mails when filter cleaning is completed.',
    label: 'Filter cleaning notifications',
    itens: [
      {
        label: 'Send filter cleaning e-mails',
        subLabel: '(only on grow plan)',
        description: 'Send e-mails when filter cleaning is completed.',
        name: 'sendFilterCleaningEmails'
      }
    ]
  }
];

export function FilterMaintenanceCard({ 
  company, 
  form, 
  onFilterSubmit, 
  filterFieldsChanged 
}: FilterMaintenanceCardProps) {
  const { isPending: isEmailPending } = useUpdateCompanyPreferences(company.id);
  const { isFreePlan } = useUserStore(
    useShallow((state) => ({
      isFreePlan: state.isFreePlan
    }))
  );

    const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Card className="w-full border-2 border-green-200">
      <CardHeader 
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-colors"
        onClick={toggleCollapsed}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Filter className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-green-900">Filter Maintenance</CardTitle>
              <CardDescription className="text-green-700">
                Set up automatic filter cleaning schedules and reminders
              </CardDescription>
            </div>
          </div>
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-green-600 transition-transform duration-200",
              collapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </CardHeader>
      {!collapsed && (
        <>
          <CardContent className="p-6">
            {filterFields.map((field) => (
              <div key={field.label} className="grid w-full grid-cols-1 items-center space-y-4 md:grid-cols-12">
                <div className="col-span-8 row-auto flex flex-col">
                  <label htmlFor={field.label} className="flex flex-col space-y-1">
                    <span className="text-sm font-semibold text-gray-800">{field.label}</span>
                  </label>
                  <span className="text-muted-foreground text-sm font-normal">{field.description}</span>
                </div>
                <div className="col-span-4 flex flex-col gap-2">
                  {field.itens.map((item) => {
                    const isFilterEmailField = item.name === 'sendFilterCleaningEmails';

                    return (
                      <div key={item.name} className="flex w-full items-center gap-4">
                        <div className={field.type === FieldType.Default ? 'w-full' : ''}>
                          <InputField
                            disabled={isFilterEmailField && isFreePlan}
                            name={item.name}
                            type={'type' in item ? item.type : field.type}
                            placeholder={field.type === FieldType.Default ? item.label : ''}
                          />
                        </div>
                        {field.type === FieldType.Switch && (
                          <label htmlFor={item.label}>
                            <div>
                              <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                            </div>
                            {'subLabel' in item && item.subLabel ? (
                              <div>
                                <span className="text-sm font-normal text-gray-800">{item.subLabel}</span>
                              </div>
                            ) : null}
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
          
          {/* Filter Maintenance Save Button */}
          <div className="border-t bg-gray-50 p-4">
            <div className="flex justify-center">
              <Button 
                type="button"
                disabled={!filterFieldsChanged() || isEmailPending} 
                className="w-full max-w-xs"
                onClick={() => {
                  const formData = form.getValues();
                  onFilterSubmit(formData);
                }}
              >
                {isEmailPending ? (
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
                ) : (
                  'Save Filter Preferences'
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
