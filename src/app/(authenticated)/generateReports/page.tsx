'use client';

import { PDFDownloadLink, PDFRenderer, PDFViewer } from '@react-pdf/renderer';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import DatePickerField from '@/components/DatePickerField';
import { QuixotePdf } from '@/components/Pdf';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUserContext } from '@/context/user';
import { clientAxios } from '@/lib/clientAxios';

export default function Page() {
  const { user } = useUserContext();
  const [pdfData, setPdfData] = useState(null);

  const form = useForm({
    fromDate: '',
    toDate: '',
    assignmentToId: ''
  });

  const subContractors = useMemo(() => {
    if (!user) return [];
    const userAsSubcontractor = {
      key: user.id,
      name: user.firstName + ' ' + user.lastName,
      value: user.id
    };
    return user.subcontractors
      .filter((sub) => sub.status === 'Active')
      .map((sub) => ({
        key: sub.subcontractorId,
        name: sub.subcontractor.firstName + ' ' + sub.subcontractor.lastName,
        value: sub.subcontractorId
      }))
      .concat(userAsSubcontractor);
  }, [user]);

  const handleSubmit = async (formData) => {
    try {
      const { fromDate, toDate, assignmentToId } = formData;

      // Montando os parâmetros da URL
      const params = new URLSearchParams({
        from: fromDate,
        to: toDate,
        technicianId: assignmentToId
      });

      // Fazendo a solicitação HTTP
      const response = await clientAxios.get(`/services/reports?${params}`);

      // Manipulando a resposta
      // console.log('Resposta do backend:', response.data);
      // console.log(formData);
      setPdfData(response.data);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };
  console.log(pdfData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="text-black-500 text-xl font-semibold">Generate service and payment reports</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium   text-gray-500">
            Select who you want to generate a report from and select an interval.
          </div>
          <div className="inline-flex justify-start gap-4 self-stretch">
            <SelectField
              disabled={subContractors.length === 0}
              name="assignmentToId"
              placeholder="Technician"
              form={form}
              data={subContractors?.length > 0 ? subContractors : []}
            />
            <div className="inline-flex items-start justify-start gap-4">
              <DatePickerField form={form} name="fromDate" placeholder="From date:" />
              <DatePickerField form={form} name="toDate" placeholder="To date:" />
            </div>
          </div>
          <Button className="w-full" type="submit">
            Generate report
          </Button>
        </div>
      </form>

      {pdfData && (
        <Button>
          <PDFDownloadLink document={<QuixotePdf pdfData={pdfData} />} fileName="report.pdf">
            {({ blob, url, loading, error }) =>
              loading ? (
                'Loading document...'
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Open PDF
                </a>
              )
            }
          </PDFDownloadLink>
        </Button>
      )}
    </Form>
  );
}
