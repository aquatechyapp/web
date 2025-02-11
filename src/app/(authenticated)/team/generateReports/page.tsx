'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

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

const schema = z.object({
  fromDate: z.date(),
  toDate: z.date(),
  memberId: z.string().min(1, 'Member is required')
});

type FormSchema = z.infer<typeof schema>;

export default function Page() {
  const user = useUserStore((state) => state.user);
  const [pdfData, setPdfData] = useState(null);
  const { data: members, isLoading: isLoadingMembers } = useGetMembersOfAllCompaniesByUserId(user.id);
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
        completedByUserId: memberId
      });

      const response = await clientAxios.get(`/services/reports?${params}`);
      setPdfData(response.data.report);
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setIsLoadingReport(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 p-2">
          <div className="flex flex-col justify-start gap-4 self-stretch md:flex-row">
            <SelectField
              disabled={members.length === 0}
              name="memberId"
              placeholder="Select member"
              options={
                members?.length > 0
                  ? members.map((member) => {
                      return {
                        key: member.id,
                        value: member.id,
                        name: member.firstName + ' ' + member.lastName
                      };
                    })
                  : []
              }
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
          <Button className="w-full" type="submit" disabled={isLoading}>
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

      {pdfData && <QuixotePdf pdfData={pdfData} />}
    </Form>
  );
}
