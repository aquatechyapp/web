'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { paymentType } from '@/constants';
import { onlyNumbers } from '@/utils';

import InputField from '../../../../components/InputField';
import SelectField from '../../../../components/SelectField';
import { Button } from '../../../../components/ui/button';
import { Form } from '../../../../components/ui/form';
import { useToast } from '../../../../components/ui/use-toast';
import { useUserContext } from '../../../../context/user';
import { clientAxios } from '../../../../lib/clientAxios';

const schema = z.object({
  emailSubContractor: z.string().email({ message: 'Invalid email' }),
  paymentValue: z.preprocess(
    (value) => {
      if (typeof value === 'string') {
        return onlyNumbers(value);
      }
      return value;
    },
    z.coerce.number().min(1, { message: 'Required' })
  ),
  paymentType: z.string().min(1)
});

export default function Page() {
  const { setUser } = useUserContext();
  const { push } = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailSubContractor: '',
      paymentValue: undefined,
      paymentType: ''
    }
  });

  const { mutate: handleSubmit } = useMutation({
    mutationFn: async (data) =>
      clientAxios.post('/workrelations', {
        ...data,
        paymentValue: data.paymentValue
      }),
    onSuccess: (res) => {
      setUser((user) => ({
        ...user,
        subcontractors: [...user.subcontractors, res.data]
      }));
      push('/team');
      toast({
        duration: 2000,
        title: 'Technician added successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: (error) => {
      toast({
        duration: 2000,
        title: 'Error adding technician',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium   text-gray-500">Basic information</div>
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
              type={form.watch('paymentType') === 'percentageFixedByPool' ? 'percentValue' : 'currencyValue'}
            />
          </div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
