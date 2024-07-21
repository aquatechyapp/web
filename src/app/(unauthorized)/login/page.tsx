'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import imageIcon from '/public/images/logoHor.png';
import { useLoginUser } from '@/hooks/react-query/user/loginUser';

import InputField from '../../../components/InputField';
import { Button } from '../../../components/ui/button';
import { Form } from '../../../components/ui/form';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }
  });

  const { mutate: handleSubmit, isPending, error } = useLoginUser();
  const isPasswordOrEmailIncorrect =
    error?.response?.status === 401 && error?.response?.data.message === 'Invalid email or password.';
  return (
    <div className="inline-flex w-[448px] flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8">
      <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <Image width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
      </div>
      <div className="relative mt-4 h-[50px] w-[400px]">
        <div className="left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px]  text-gray-900">Login</div>
        <div className=" left-0 top-[30px] h-5 w-[400px]">
          <span className="text-sm font-medium   text-gray-500">Don't you have an account? </span>
          <Link href="/signup" className="text-sm font-bold   text-gray-500">
            Signup
          </Link>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
          <div className="mb-8 flex w-[400px] flex-col gap-[18px]">
            <InputField form={form} name="email" placeholder="E-mail address" />
            <InputField form={form} name="password" placeholder="Password" type="password" />
            {error && (
              <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">
                {isPasswordOrEmailIncorrect ? 'E-mail or password incorrect' : 'Internal server error'}
              </p>
            )}
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
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
