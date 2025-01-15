'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import DatePickerField from '@/components/DatePickerField';
import { QuixotePdf } from '@/components/Pdf';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { clientAxios } from '@/lib/clientAxios';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useUserStore } from '@/store/user';
import { SubcontractorStatus } from '@/ts/enums/enums';
import useGetMembersOfAllCompaniesByUserId from '@/hooks/react-query/companies/getMembersOfAllCompaniesByUserId';

const schema = z.object({
  fromDate: defaultSchemas.date,
  toDate: defaultSchemas.date,
  memberId: z.string().min(1)
});

type FormSchema = z.infer<typeof schema>;

export default function Page() {
  const user = useUserStore((state) => state.user);
  const [pdfData, setPdfData] = useState(null);
  const { data: members, isLoading } = useGetMembersOfAllCompaniesByUserId(user.id);

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromDate: undefined,
      toDate: undefined,
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
      const { fromDate, toDate, memberId } = formData;

      const params = new URLSearchParams({
        from: fromDate.toString(),
        to: toDate.toString(),
        completedByUserId: memberId
      });

      const response = await clientAxios.get(`/services/reports?${params}`);

      // Manipulando a resposta
      setPdfData(response.data.report);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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
              <DatePickerField disabled={[{ after: new Date() }]} name="fromDate" placeholder="From date:" />
              <DatePickerField disabled={[{ after: new Date() }]} name="toDate" placeholder="To date:" />
            </div>
          </div>
          <Button className="w-full" type="submit">
            Generate report
          </Button>
        </div>
      </form>

      {pdfData && <QuixotePdf pdfData={pdfData} />}
    </Form>
  );
}
