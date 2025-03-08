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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="inline-flex w-96 flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8 md:w-[680px]"
      >
        <div className="mb-8 inline-flex h-5 items-center justify-center gap-3 self-stretch">
          <Image priority width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
        </div>

        <div className="relative h-[50px] w-full">
          <div className="text-xl font-semibold leading-[30px] text-gray-900">Reset password</div>
        </div>

        <div className="mb-8 flex w-full flex-col gap-[18px]">
          <InputField name="newPassword" label="New Password" placeholder="New Password" type={FieldType.Password} />
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            type={FieldType.Password}
          />
        </div>

        {isError && (
          <div className="mb-4 text-center text-sm">
            Internal error, please contact us at{' '}
            <span className="font-semibold text-blue-500">contact@aquatechy.com</span>
          </div>
        )}

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? (
            <div
              className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            />
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </Form>
  );
}
