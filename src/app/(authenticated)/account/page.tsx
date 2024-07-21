'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUpdateUser } from '@/hooks/react-query/user/updateUser';
import { useUserStore } from '@/store/user';
import { isEmpty } from '@/utils';
import { filterChangedFormFields } from '@/utils/formUtils';

import SelectField from '../../../components/SelectField';

export default function Page() {
  const user = useUserStore((state) => state.user);
  const { mutate, isPending } = useUpdateUser();

  const form = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      company: user?.company || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: user?.address || '',
      zip: user?.zip || '',
      state: user?.state || '',
      city: user?.city || '',
      language: user?.language || ''
    }
  });

  const phoneIsDirty = useMemo(() => form.watch('phone') !== user?.phone, [form.watch('phone'), user?.phone]);
  const languageSelectOptions = ['English', 'Portuguese', 'Spanish'].map((lang) => ({ value: lang, name: lang }));

  const isDirty = useMemo(
    () => !isEmpty(filterChangedFormFields(form.getValues(), form.formState.dirtyFields)) || phoneIsDirty,
    [form.getValues()]
  );

  if (isPending) return <LoadingSpinner />;

  function handleSubmit(data) {
    let dirtyFields = filterChangedFormFields(form.getValues(), form.formState.dirtyFields);
    if (phoneIsDirty) {
      dirtyFields = {
        ...dirtyFields,
        phone: form.getValues().phone
      };
      mutate(dirtyFields);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="mt-6 text-xl font-semibold leading-[30px]  text-gray-800">My account</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5  text-sm font-medium   text-gray-500">Basic Information</div>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField form={form} name="firstName" placeholder="First name" />
            <InputField form={form} name="lastName" placeholder="Last name" />
            <InputField form={form} name="company" placeholder="Company" />
          </div>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField form={form} name={'address'} placeholder="Address" />
            <StateAndCitySelect form={form} cityName="city" stateName="state" />
            <InputField form={form} name={'zip'} placeholder="Zip code" />
          </div>
          <div className="h-5 w-[213.40px] text-sm font-medium   text-gray-500">Contact information</div>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField form={form} name="phone" placeholder="Mobile phone" type="phone" />
            <InputField form={form} name="email" placeholder="E-mail" />
            <SelectField
              data={languageSelectOptions}
              form={form}
              label="Language"
              name="language"
              placeholder="Language"
            />
          </div>
          {isDirty && (
            <Button type="submit" className="h-10 w-full">
              Update account
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
