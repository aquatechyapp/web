'use client';

import InputField from '@/app/_components/InputField';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import StateAndCitySelect from '@/app/_components/StateAndCitySelect';
import { Button } from '@/app/_components/ui/button';
import { Form } from '@/app/_components/ui/form';
import { useUserContext } from '@/context/user';
import { useUpdateUser } from '@/hooks/react-query/user/updateUser';
import { filterChangedFormFields } from '@/utils/getDirtyFields';
import { useForm } from 'react-hook-form';

export default function Page() {
  const { user } = useUserContext();
  const { mutate, isPending } = useUpdateUser();

  const form = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      company: user?.company || '',
      phone: user?.phone || '',
      email: user?.email || ''
    }
  });

  if (isPending) return <LoadingSpinner />;

  function handleSubmit(data) {
    mutate(
      filterChangedFormFields(form.getValues(), form.formState.dirtyFields)
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="mt-6 text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
          My account
        </div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-white p-6">
          <div className="h-5  text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Basic information
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <InputField form={form} name="firstName" placeholder="First name" />
            <InputField form={form} name="lastName" placeholder="Last name" />
            <InputField form={form} name="company" placeholder="Company" />
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <InputField form={form} name={'address'} placeholder="Address" />
            <StateAndCitySelect form={form} />
            <InputField form={form} name={'zip'} placeholder="Zip code" />
          </div>
          <div className="h-5 w-[213.40px] text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Contact information
          </div>
          <div className="inline-flex items-start justify-start gap-4 self-stretch">
            <InputField
              form={form}
              name="phone"
              placeholder="Mobile phone"
              type="phone"
            />
            <InputField form={form} name="email" placeholder="E-mail" />
          </div>
          {form.formState.isDirty && (
            <Button type="submit" className="h-10 w-full">
              Update account
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
