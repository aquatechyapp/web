'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import imageIcon from '/public/images/logoHor.png';
import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useSendRecoverEmail } from '@/hooks/react-query/user/useSendRecoverEmail';
import { defaultSchemas } from '@/schemas/defaultSchemas';

const formSchema = z.object({
  email: defaultSchemas.email
});

export default function Page() {
  const { mutate, isPending } = useSendRecoverEmail();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  return (
    <div className="inline-flex w-96 flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8 md:w-[680px]">
      <div className="mb-8 inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <Image priority width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
      </div>

      <div className="relative h-[50px] w-full">
        <div className="left-0 top-0 h-[30px] w-full text-xl font-semibold leading-[30px] text-gray-900">
          Recover Password
        </div>
        <div className="left-0 top-[30px] h-5 w-full">
          <span className="text-sm font-medium text-gray-500">Remember your password? </span>
          <Link href="/login" className="text-sm font-semibold text-blue-500">
            Login
          </Link>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))} className="w-full">
          <div className="mb-8 flex w-full flex-col gap-[18px]">
            <InputField label="E-mail" name="email" placeholder="E-mail address" />
          </div>
          <Button disabled={isPending} type="submit" className="flex w-full">
            {isPending ? (
              <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              />
            ) : (
              'Send Recovery Email'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
