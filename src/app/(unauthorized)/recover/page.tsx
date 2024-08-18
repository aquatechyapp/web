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
    <div className="inline-flex w-[448px] flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8">
      <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <Image priority width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
      </div>
      <div className="relative mt-4">
        <div className="left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px] text-gray-900">
          Recovery Password
        </div>
        <div className="left-0 top-[30px] h-5 w-[400px]">
          <span className="text-sm font-medium text-gray-500">Back to </span>
          <Link href="/login" className="text-sm font-semibold text-blue-500">
            Login
          </Link>
          <span className="text-sm font-medium text-gray-500"> page</span>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutate(data))}
          className="inline-flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-gray-50"
        >
          <InputField name="email" label="Email" placeholder="Email" className="w-full" />
          <Button disabled={isPending} className="w-full">
            Send email
          </Button>
        </form>
      </Form>
    </div>
  );
}
