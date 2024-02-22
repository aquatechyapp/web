'use client';

import InputField from '@/app/_components/InputField';
import SelectField from '@/app/_components/SelectField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/user';
import useLocalStorage from '@/hooks/useLocalStorage';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

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
  const queryClient = useQueryClient();
  const { user, setUser } = useUserContext();
  const { push } = useRouter();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      emailSubContractor: '',
      paymentValue: null
    }
  });

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (data) => clientAxios.post('/workrelations', data),
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
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            {/* <InputField form={form} name="firstName" placeholder="First name" /> */}
            {/* <InputField form={form} name="lastName" placeholder="Last name" /> */}
          </div>
          <div className="inline-flex self-stretch gap-4 justify-start">
            {/* <InputField form={form} name="address" placeholder="Address" /> */}
            {/* <StateAndCitySelect form={form} /> */}
            {/* <InputField form={form} name="zip" placeholder="Zip code" /> */}
            <InputField
              form={form}
              name="emailSubContractor"
              placeholder="E-mail"
            />
            <SelectField
              data={paymentType}
              form={form}
              name="paymentType"
              placeholder="Payment type"
            />
            {/* <InputField form={form} name="paymentValue" placeholder="US$ / %" /> */}
          </div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
