'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import imageIcon from '/public/images/logoHor.png';
import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useResetPassword } from '@/hooks/react-query/user/resetPassword';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { FieldType } from '@/ts/enums/enums';

interface Props {
  searchParams: {
    token: string;
  };
}

const formSchema = z
  .object({
    newPassword: defaultSchemas.password,
    confirmPassword: defaultSchemas.password,
    token: z.string()
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function Page({ searchParams }: Props) {
  const { mutate, isPending, isError } = useResetPassword();
  const token = searchParams.token;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      token: token
    }
  });

  function handleSubmit(data: FormValues) {
    const { token, newPassword } = data;
    mutate({ token, newPassword });
  }

  return (
    <div className="inline-flex w-[448px] flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8">
      <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <Image priority width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
      </div>
      <div className="relative mt-4">
        <div className="left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px] text-gray-900">
          Recovery Password
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="inline-flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-gray-50"
        >
          <InputField
            name="newPassword"
            label="New Password"
            placeholder="New Password"
            type={FieldType.Password}
            className="w-full"
          />
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            type={FieldType.Password}
            className="w-full"
          />
          {isError && (
            <div className="text-md flex w-full flex-col items-center justify-center">
              Internal error, please contact us <span className="font-bold text-blue-500"> contact@aquatechy.com</span>
            </div>
          )}
          <Button disabled={isPending} className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
