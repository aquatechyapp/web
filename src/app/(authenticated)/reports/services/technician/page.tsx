'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, Download, FileBarChartIcon, CalendarIcon, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useUserStore } from '@/store/user';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';
import { useGenerateTechnicianReport } from '@/hooks/react-query/reports/useGenerateTechnicianReport';
import { useGetServiceTypes } from '@/hooks/react-query/service-types/useGetServiceTypes';
import { MultiSelect } from '@/components/MultiSelect';

export default function TechnicianReportPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: members, isLoading: membersLoading } = useGetMembersOfAllCompaniesByUserId(user.id);
  const generateReportMutation = useGenerateTechnicianReport();

  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [fromDateString, setFromDateString] = useState<string | undefined>(undefined);
  const [toDateString, setToDateString] = useState<string | undefined>(new Date().toISOString());

  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
 const { data: serviceTypesData, isLoading: isServiceTypesLoading } = useGetServiceTypes(
   selectedCompany || ''
  );
  // Get unique companies from members
  const companies = useMemo(() => {
    if (!members) return [];
    const uniqueCompanies = new Map();
    members.forEach(member => {
      if (!uniqueCompanies.has(member.company.id)) {
        uniqueCompanies.set(member.company.id, {
          id: member.company.id,
          name: member.company.name
        });
      }
    });
    return Array.from(uniqueCompanies.values());
  }, [members]);

  // Filter technicians based on selected company
  const filteredTechnicians = useMemo(() => {
    if (!members) return [];
    if (!selectedCompany) return members;
    return members.filter(member => member.company.id === selectedCompany);
  }, [members, selectedCompany]);

  // Filter Type of service based on selected company
  const filteredTypeOfService = useMemo(() => {
    if (!serviceTypesData?.serviceTypes) return [];
    return serviceTypesData.serviceTypes.filter((service) => service.isActive);
  }, [serviceTypesData]);

  const handleGenerateReport = async () => {
    // if (!selectedCompany || !selectedTechnician || !fromDate || !toDate) {
    //   return;
    // }

    try {
      await generateReportMutation.mutateAsync({
        assignedToId: selectedTechnician,
        companyId: selectedCompany,
        serviceTypeId: selectedServiceTypes,
        fromDate: fromDateString!,
        toDate: toDateString!,
        // assignedToId: '68583a38ee3703ae8bbc6814',
        // companyId: '6851cc016cf25bdb17a55ca6',
        // fromDate: new Date('2025-09-29'),
        // toDate: new Date('2025-10-04')
      });
      console.log('Report generation completed successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please check the console for details.');
    }
  };

  const canGenerateReport =
    selectedCompany &&
    selectedTechnician &&
    selectedServiceTypes.length > 0
    // fromDateString &&
    // toDateString;

  console.log('selectedServiceTypes', selectedServiceTypes)

  if (membersLoading || isServiceTypesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Service Reports
        </Button>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileBarChartIcon className="h-6 w-6 text-blue-600" />
          Technician Performance Report
        </h1>
        <p className="text-gray-600 mt-2">
          Generate and download detailed PDF reports showing service completion rates and efficiency metrics for specific technicians.
        </p>
      </div>

      <div className="max-w-full">
        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Report Filters
            </CardTitle>
            <CardDescription>
              Select company, technician and date range for the report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company
              </label>
              <Select value={selectedCompany} onValueChange={(value) => {
                setSelectedCompany(value);
                setSelectedTechnician(''); // Reset technician when company changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Technician</label>
              <Select
              disabled={!selectedCompany}
               value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a technician" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTechnicians?.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type of Service</label>
              <MultiSelect
              disabled={!selectedCompany}
                options={filteredTypeOfService.map((service) => ({
                  label: service.name,
                  value: service.id,
                }))}
                selected={selectedServiceTypes}
                onChange={setSelectedServiceTypes}
                placeholder="Select service types"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">From Date</label>
              <DatePicker
                placeholder="Select start date"
                value={fromDate}
                className='w-full'
                onChange={(date) => {
                  if (date) {
                    const startOfDay = new Date(date);
                    startOfDay.setHours(0, 0, 0, 0);
                    setFromDate(startOfDay);
                    setFromDateString(startOfDay.toISOString());
                  } else {
                    setFromDate(undefined);
                    setFromDateString(undefined);
                  }
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">To Date</label>
              <DatePicker
                placeholder="Select end date"
                value={toDate}
                className='w-full'
                onChange={(date) => {
                  if (date) {
                    const endOfDay = new Date(date);
                    endOfDay.setHours(23, 59, 59, 999);
                    setToDate(endOfDay);

                    setToDateString(endOfDay.toISOString());
                  } else {
                    setToDate(undefined);
                    setToDateString(undefined);
                  }
                }}
              />
            </div>

            <Button
              onClick={handleGenerateReport}
              disabled={!canGenerateReport || generateReportMutation.isPending}
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {generateReportMutation.isPending ? 'Generating PDF...' : 'Generate & Download PDF'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
