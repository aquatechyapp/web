'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { Typography } from '@/components/Typography';
import { paymentType } from '@/constants';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';

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
  const { setUser, user } = useUserStore(
    useShallow((state) => ({
      setUser: state.setUser,
      user: state.user
    }))
  );
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
      const description = res.data.newUser
        ? 'User received an e-mail to activate the account.'
        : 'The technician was added successfully.';

      setUser({
        ...user,
        workRelationsAsAEmployer: [...user.workRelationsAsAEmployer, res.data.workRelationWithUsersInfo]
      });

      push('/team');

      return toast({
        duration: 8000,
        title: 'Technician added successfully',
        description,
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      const title = 'Error adding technician';
      const description = error.response?.data?.message ? error.response.data.message : 'Internal server error';

      toast({
        duration: 8000,
        title,
        variant: 'error',
        description
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50">
          <Typography element="h3">Basic information</Typography>
          <div className="inline-flex flex-wrap justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name="emailSubContractor" placeholder="E-mail" label="E-mail" />
            <SelectField options={paymentType} name="paymentType" placeholder="Payment Type" label="Payment Type" />
            <InputField
              name="paymentValue"
              label="Payment Value"
              placeholder="US$ / %"
              type={
                form.watch('paymentType') === 'percentageFixedByPool' ? FieldType.PercentValue : FieldType.CurrencyValue
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
}
