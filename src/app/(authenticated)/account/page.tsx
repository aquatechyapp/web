'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import StateAndCitySelect from '@/components/StateAndCitySelect';
import { Typography } from '@/components/Typography';
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
        <div className="inline-flex w-full flex-col items-start justify-start gap-2">
          <Typography element="h3">Basic Information</Typography>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name="firstName" label="First Name" placeholder="First Name" />
            <InputField name="lastName" label="Last Name" placeholder="Last Name" />
            <InputField name="company" label="Company" placeholder="Company" />
          </div>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name={'address'} label="Address" placeholder="Address" />
            <StateAndCitySelect cityName="city" stateName="state" />
            <InputField name={'zip'} placeholder="Zip code" label="Zip code" />
          </div>
          <Typography element="h3">Contact Information</Typography>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name="phone" placeholder="Phone" label="Phone" type={FieldType.Phone} />
            <InputField disabled name="email" placeholder="E-mail" label="E-mail" />
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
