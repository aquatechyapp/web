'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import DatePickerField from '@/components/DatePickerField';
import { QuixotePdf } from '@/components/Pdf';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { SubcontractorStatus } from '@/constants/enums';
import { clientAxios } from '@/lib/clientAxios';
import { useUserStore } from '@/store/user';

const schema = z.object({
  fromDate: z.string().min(1),
  toDate: z.string().min(1),
  assignmentToId: z.string().min(1)
});

type FormSchema = z.infer<typeof schema>;

export default function Page() {
  const user = useUserStore((state) => state.user);
  const [pdfData, setPdfData] = useState(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromDate: '',
      toDate: '',
      assignmentToId: ''
    }
  });

  const subContractors = useMemo(() => {
    if (!user) return [];
    const userAsSubcontractor = {
      key: user.id,
      name: user.firstName + ' ' + user.lastName,
      value: user.id
    };
    return user.workRelationsAsAEmployer
      .filter((sub) => sub.status === SubcontractorStatus.Active)
      .map((sub) => ({
        key: sub.subcontractorId,
        name: sub.subcontractor.firstName + ' ' + sub.subcontractor.lastName,
        value: sub.subcontractorId
      }))
      .concat(userAsSubcontractor);
  }, [user]);

  const handleSubmit = async (formData: FormSchema) => {
    try {
      const { fromDate, toDate, assignmentToId } = formData;

      const params = new URLSearchParams({
        from: fromDate,
        to: toDate,
        technicianId: assignmentToId
      });

      const response = await clientAxios.get(`/services/reports?${params}`);

      // Manipulando a resposta
      setPdfData(response.data);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="text-black-500 text-xl font-semibold">Generate service and payment reports</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium text-gray-500">
            Select who you want to generate a report from and select an interval.
          </div>
          <div className="flex flex-col justify-start gap-4 self-stretch md:flex-row">
            <SelectField
              disabled={subContractors.length === 0}
              name="assignmentToId"
              placeholder="Technician"
              options={subContractors?.length > 0 ? subContractors : []}
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
