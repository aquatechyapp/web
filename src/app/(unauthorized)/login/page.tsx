'use client';

import { Form } from '../../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import InputField from '../../../components/InputField';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientAxios } from '../../../lib/clientAxios';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../../../components/ui/use-toast';
import { useUserContext } from '../../../context/user';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
});

export default function Page() {
  const { push } = useRouter();
  const { toast } = useToast();
  const { setUser } = useUserContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }
  });

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (data) => await clientAxios.post('/sessions', data),
    onSuccess: async ({ data }) => {
      Cookies.set('accessToken', data.accessToken);
      // Usado pois ao fazer login e dar push('/dashboard') o token não é encontrado ainda
      await new Promise((resolve) => setTimeout(resolve, 100));
      Cookies.set('userId', data.user.id);
      setUser({
        ...data.user,
        incomeAsACompany: data.incomeAsACompany,
        incomeAsASubcontractor: data.incomeAsASubcontractor
      });
      push('/dashboard');
      toast({
        variant: 'default',
        title: 'Login successful!',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      if (error.message === 'Network Error') {
        toast({
          variant: 'default',
          title: 'Internal error',
          description: 'Please try again later',
          className: 'bg-red-500 text-white'
        });
      } else {
        setError('E-mail or password incorrect');
      }
    }
  });

  const [error, setError] = useState<string | null>(false);

  return (
    <div className="inline-flex w-[448px] flex-col items-start justify-start gap-[18px] rounded-lg bg-white px-6 py-8">
      <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <div className="font-['General Sans'] shrink grow basis-0 self-stretch text-center text-2xl font-semibold leading-normal text-gray-600">
          Aquatechy
        </div>
      </div>
      <div className="relative h-[50px] w-[400px]">
        <div className="font-['Public Sans']  left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
          Login
        </div>
        <div className=" left-0 top-[30px] h-5 w-[400px]">
          <span className="font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Don't you have an account?{' '}
          </span>
          <Link
            href="/signup"
            className="font-['Public Sans'] text-sm font-bold leading-tight tracking-tight text-zinc-500"
          >
            Signup
          </Link>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
          <div className="w-[400px] gap-[18px] flex flex-col mb-8">
            <InputField form={form} name="email" placeholder="E-mail address" />
            <InputField
              form={form}
              name="password"
              placeholder="Password"
              type="password"
            />
            {error && (
              <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">
                E-mail or password incorrect
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
