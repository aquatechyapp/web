'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { paymentType } from '@/constants';
import { FieldType } from '@/constants/enums';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useUserStore } from '@/store/user';

import InputField from '../../../../components/InputField';
import SelectField from '../../../../components/SelectField';
import { Button } from '../../../../components/ui/button';
import { Form } from '../../../../components/ui/form';
import { useToast } from '../../../../components/ui/use-toast';
import { clientAxios } from '../../../../lib/clientAxios';

const schema = z.object({
  emailSubContractor: z.string().email({ message: 'Invalid email' }),
  paymentValue: defaultSchemas.monthlyPayment,
  paymentType: z.string().min(1)
});

type FormSchema = z.infer<typeof schema>;

export default function Page() {
  const { setUser, user } = useUserStore();
  const { push } = useRouter();
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailSubContractor: '',
      paymentValue: undefined,
      paymentType: ''
    }
  });

  const { mutate: handleSubmit } = useMutation({
    mutationFn: async (data: FormSchema) =>
      clientAxios.post('/workrelations', {
        ...data
      }),
    onSuccess: (res) => {
      setUser({
        ...user,
        subcontractors: [...user.subcontractors, res.data]
      });

      push('/team');
      toast({
        duration: 2000,
        title: 'Technician added successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error adding technician',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium text-gray-500">Basic information</div>
          <div className="inline-flex flex-wrap justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField form={form} name="emailSubContractor" placeholder="E-mail" />
            <SelectField
              data={paymentType}
              form={form}
              name="paymentType"
              placeholder="Payment Type"
              label="Payment Type"
            />
            <InputField
              form={form}
              name="paymentValue"
              label="Payment Value"
              placeholder="US$ / %"
              type={
                form.watch('paymentType') === 'percentageFixedByPool' ? FieldType.PercentValue : FieldType.CurrencyValue
              }
            />
          </div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
