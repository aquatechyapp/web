'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUpdateUser } from '@/hooks/react-query/user/updateUser';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useUserStore } from '@/store/user';
import { FieldType, LanguageOptions } from '@/ts/enums/enums';

const formSchema = z.object({
  firstName: defaultSchemas.name,
  lastName: defaultSchemas.name,
  company: defaultSchemas.name,
  phone: defaultSchemas.phone,
  email: defaultSchemas.email,
  address: defaultSchemas.address,
  zip: defaultSchemas.zipCode,
  state: defaultSchemas.state,
  city: defaultSchemas.city,
  language: defaultSchemas.language
});

export type IUserSchema = z.infer<typeof formSchema>;

export default function Page() {
  const user = useUserStore((state) => state.user);
  const { mutate, isPending } = useUpdateUser();

  const form = useForm<IUserSchema>({
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
      language: user?.language || LanguageOptions.English
    },
    resolver: zodResolver(formSchema)
  });

  if (isPending) return <LoadingSpinner />;

  // const phoneIsDirty = useMemo(() => form.watch('phone') !== user?.phone, [form.watch('phone'), user?.phone]);
  // const languageSelectOptions = ['English', 'Portuguese', 'Spanish'].map((lang) => ({ value: lang, name: lang }));

  // const isDirty = useMemo(() => form.formState.isDirty || phoneIsDirty, [form.getValues()]);

  function handleSubmit(data: IUserSchema) {
    // if (phoneIsDirty) {
    //   newData = {
    //     ...newData,
    //     phone: form.getValues().phone
    //   };
    // }
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="mt-6 text-xl font-semibold leading-[30px] text-gray-800">My account</div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-50 p-6">
          <div className="h-5 text-sm font-medium text-gray-500">Basic Information</div>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name="firstName" placeholder="First name" />
            <InputField name="lastName" placeholder="Last name" />
            <InputField name="company" placeholder="Company" />
          </div>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name={'address'} placeholder="Address" />
            <StateAndCitySelect cityName="city" stateName="state" />
            <InputField name={'zip'} placeholder="Zip code" />
          </div>
          <div className="h-5 w-[213.40px] text-sm font-medium text-gray-500">Contact information</div>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name="phone" placeholder="Mobile phone" type={FieldType.Phone} />
            <InputField name="email" placeholder="E-mail" />
            {/* <SelectField
              data={languageSelectOptions}

              label="Language"
              name="language"
              placeholder="Language"
            /> */}
          </div>
          {/* {isDirty && ( */}
          <Button type="submit" className="h-10 w-full">
            Update account
          </Button>
          {/* )} */}
        </div>
      </form>
    </Form>
  );
}
