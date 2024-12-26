'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import imageIcon from '/public/images/logoHor.png';
import { useLoginUser } from '@/hooks/react-query/user/loginUser';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { FieldType } from '@/ts/enums/enums';

import InputField from '../../../components/InputField';
import { Button } from '../../../components/ui/button';
import { Form } from '../../../components/ui/form';

const formSchema = z.object({
  email: defaultSchemas.email,
  password: z.string().min(1, { message: 'Password is required' })
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }
  });

  const { mutate: handleSubmit, isPending, error } = useLoginUser();
  let messageError = 'Internal server error';
  if (
    isAxiosError(error) &&
    error?.response?.status === 404 &&
    error?.response?.data.message === 'Invalid credentials.'
  ) {
    messageError = 'E-mail or password incorrect';
  }

  return (
    <div className="inline-flex w-96 flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8 md:w-[680px]">
      <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <Image priority width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
      </div>
      <div className="relative mt-4 h-[50px] w-full">
        <div className="left-0 top-0 h-[30px] w-full text-xl font-semibold leading-[30px] text-gray-900">Login</div>
        <div className="left-0 top-[30px] h-5 w-full">
          <span className="text-sm font-medium text-gray-500">Don't you have an account? </span>
          <Link href="/signup" className="text-sm font-semibold text-blue-500">
            Sign Up
          </Link>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => handleSubmit(data))} className="w-full">
          <div className="mb-8 flex w-full flex-col gap-[18px]">
            <InputField label="E-mail" name="email" placeholder="E-mail address" />
            <InputField label="Password" name="password" placeholder="Password" type={FieldType.Password} />
            <Link href="/recover" className="text-sm font-semibold text-blue-500">
              Forgot Password?
            </Link>
            {error && <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">{messageError}</p>}
          </div>
          <Button disabled={isPending} type="submit" className="flex w-full">
            {isPending ? (
              <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              />
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
