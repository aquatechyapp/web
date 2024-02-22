'use client';

import InputField from '@/app/_components/InputField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useForm } from 'react-hook-form';

export default function Page() {
  const [user] = useLocalStorage('user', '');
  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      company: user?.company || '',
      phone: user?.phone || '',
      email: user?.email || ''
    }
  });

  return (
    <Form {...form}>
      <form>
        <div className="mt-6 text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
          My account
        </div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
          <div className="h-5  text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Basic information
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <Input placeholder="Register as a person or as a company?" />
            <InputField form={form} name="name" placeholder="First name" />
            <Input placeholder="Last name" />
            <InputField form={form} name="company" placeholder="Company" />
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <Input placeholder="Address" />
            <Input placeholder="State" />
            <Input placeholder="City" />
            <Input placeholder="Zip code" />
          </div>
          <div className="h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Contact information
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <InputField form={form} name="phone" placeholder="Mobile phone" />
            <InputField form={form} name="email" placeholder="E-mail" />
          </div>
          <Button className="h-10 w-full">Update account</Button>
        </div>
      </form>
    </Form>
  );
}
