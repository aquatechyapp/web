'use client';

import InputField from '@/app/_components/InputField';
import SelectField from '@/app/_components/SelectField';
import { Button } from '@/app/_components/ui/button';
import { Form } from '@/app/_components/ui/form';
import { useToast } from '@/app/_components/ui/use-toast';
import { useUserContext } from '@/context/user';
import { clientAxios } from '@/services/clientAxios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  emailSubContractor: z.string().email({ message: 'Invalid email' }),
  paymentValue: z.preprocess(
    (value) => value.replace(/\D/g, ''),
    z.coerce.number().min(1, { message: 'Required' })
  ),
  paymentType: z.string().min(1)
});

const paymentType = [
  {
    key: 'valueFixedByPool',
    value: 'valueFixedByPool',
    name: 'Fixed value by pool'
  },
  {
    key: 'percentageFixedByPool',
    value: 'percentageFixedByPool',
    name: '% fixed by pool'
  },
  { key: 'customized', value: 'customized', name: 'Custom' }
];

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
        paymentValue: data.paymentValue * 100
      }),
    onSuccess: (res) => {
      setUser((user) => ({
        ...user,
        subcontractors: [...user.subcontractors, res.data]
      }));
      push('/team');
      toast({
        variant: 'default',
        title: 'Technician added successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error adding technician',
        className: 'bg-red-500 text-white'
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
          <div className="font-['Public Sans'] h-5 text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Basic information
          </div>
          <div className="inline-flex self-stretch gap-4 justify-start">
            <InputField
              form={form}
              name="emailSubContractor"
              placeholder="E-mail"
            />
            <SelectField
              data={paymentType}
              form={form}
              name="paymentType"
              placeholder="Payment Type"
            />
            <InputField
              form={form}
              name="paymentValue"
              label="Payment Value"
              placeholder="US$ / %"
              type={
                form.watch('paymentType') === 'percentageFixedByPool'
                  ? 'percentValue'
                  : 'currencyValue'
              }
            />
          </div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
