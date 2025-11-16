'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import DatePickerField from '@/components/DatePickerField';
import { QuixotePdf } from '@/components/Pdf';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { clientAxios } from '@/lib/clientAxios';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useUserStore } from '@/store/user';
import { SubcontractorStatus } from '@/ts/enums/enums';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';
import { DatePicker } from '@/components/ui/date-picker';
import type { DateRange } from 'react-day-picker';
import { PdfViewer } from '@/components/PdfViewer';

const schema = z.object({
  fromDate: z.date(),
  toDate: z.date(),
  memberId: z.string().min(1, 'Member is required')
});

type FormSchema = z.infer<typeof schema>;

export default function Page() {
  const user = useUserStore((state) => state.user);
  const { data: members = [], isLoading: isLoadingMembers } = useGetMembersOfAllCompaniesByUserId(user.id);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const isLoading = isLoadingMembers || isLoadingReport;

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
      memberId: ''
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  const handleSubmit = async (formData: FormSchema) => {
    try {
      setIsLoadingReport(true);
      const { fromDate, toDate, memberId } = formData;

      const params = new URLSearchParams({
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        completedByUserId: memberId,
        format: 'pdf'
      });

      const response = await clientAxios.get(`/services/reports`, {
        params,
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `services-report-${format(fromDate, 'yyyy-MM-dd')}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoadingReport(false);
    }
  };

  const isFormValid =
    form.formState.isValid &&
    form.watch('memberId') &&
    form.watch('fromDate') &&
    form.watch('toDate') &&
    new Date(form.watch('fromDate')) <= new Date(form.watch('toDate'));

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="inline-flex w-full flex-col items-start justify-start gap-4 p-2">
            <div className="flex flex-col justify-start gap-4 self-stretch md:flex-row">
              <SelectField
                disabled={members.length === 0}
                name="memberId"
                placeholder="Select member"
                options={members.map((member) => ({
                  key: member.id,
                  value: member.id,
                  name: `${member.firstName} ${member.lastName}`
                }))}
              />
              <div className="inline-flex w-full items-start justify-start gap-4">
                <FormItem className="flex w-full flex-row items-center gap-2">
                  <FormControl>
                    <DatePicker
                      className="w-full"
                      placeholder="From date:"
                      disabled={[{ from: new Date() }]}
                      value={form.watch('fromDate') ? new Date(form.watch('fromDate')) : undefined}
                      onChange={(date: Date | undefined) => form.setValue('fromDate', date as Date)}
                    />
                  </FormControl>
                </FormItem>

                <FormItem className="flex w-full flex-row items-center gap-2">
                  <FormControl>
                    <DatePicker
                      className="w-full"
                      placeholder="To date:"
                      disabled={[{ after: new Date() }]}
                      value={form.watch('toDate') ? new Date(form.watch('toDate')) : undefined}
                      onChange={(date: Date | undefined) => form.setValue('toDate', date as Date)}
                    />
                  </FormControl>
                </FormItem>
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading || !isFormValid}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate report'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
