'use client';

import { useForm } from 'react-hook-form';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { paymentType } from '@/constants';

export default function Page() {
  const form = useForm({
    defaultValues: {
      filter: 'all'
    }
  });

  return (
    <Form {...form}>
      <form>
        <div className="text-black-500 text-xl font-semibold">Generate service and payment reports</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium   text-gray-500">
            Select who you want to generate a report from and select an interval.
          </div>
          <div className="inline-flex justify-start gap-4 self-stretch">
            <SelectField data={paymentType} form={form} name="Technician" placeholder="Technician" />
            <InputField form={form} name="fromDate" placeholder="From date:" />
            <InputField form={form} name="paymentValue" placeholder="To date:" />
          </div>
          <Button className="w-full" type="submit">
            Generate report
          </Button>
        </div>
      </form>
    </Form>
  );
}
