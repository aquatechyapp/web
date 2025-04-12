'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUpdateUser } from '@/hooks/react-query/user/updateUser';
import { defaultSchemas } from '@/schemas/defaultSchemas';
import { useUserStore } from '@/store/user';
import { FieldType, LanguageOptions } from '@/ts/enums/enums';
import { AddressInput } from '@/components/AddressInput';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../../components/ui/dialog';
import { ModalDeleteAccount } from './ModalDeleteAccount';
import ChangePasswordDialog from './change-password-modal';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { IanaTimeZones } from '@/ts/enums/enums';

const formSchema = z.object({
  firstName: defaultSchemas.firstName,
  lastName: defaultSchemas.lastName,
  company: defaultSchemas.company,
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
  const { mutate, isPending, isSuccess } = useUpdateUser(user.id);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
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

  useEffect(() => {
    if (user.firstName === '') {
      setShowModal(true);
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Account updated successfully',
        description: 'Your account has been updated successfully',
        variant: 'success'
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  }, [isSuccess]);

  if (isPending) return <LoadingSpinner />;

  function handleSubmit(data: IUserSchema) {
    mutate(data);
  }

  const handleAddressSelect = (address: {
    fullAddress: string;
    state: string;
    city: string;
    zipCode: string;
    timezone: IanaTimeZones;
  }) => {
    form.setValue('address', address.fullAddress);
    form.setValue('state', address.state);
    form.setValue('city', address.city);
    form.setValue('zip', address.zipCode);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 p-2">
          <Typography element="h3">Basic Information</Typography>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name="firstName" label="First Name" placeholder="First Name" />
            <InputField name="lastName" label="Last Name" placeholder="Last Name" />
            <InputField name="company" label="Company" placeholder="Company" />
          </div>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <AddressInput 
              name="address" 
              label="Address" 
              placeholder="Enter your address"
              onAddressSelect={handleAddressSelect}
            />
            <InputField name="state" label="State" placeholder="State" disabled />
            <InputField name="city" label="City" placeholder="City" disabled />
            <InputField name="zip" label="Zip Code" placeholder="Zip Code" disabled />
          </div>
          <Typography element="h3">Contact Information</Typography>
          <div className="inline-flex flex-wrap items-start justify-start gap-4 self-stretch md:flex-nowrap">
            <InputField name="phone" placeholder="Phone" label="Phone" type={FieldType.Phone} />
            <InputField disabled name="email" placeholder="E-mail" label="E-mail" />
          </div>
          <Button type="submit" className="h-10 w-full">
            Update account
          </Button>
        </div>
      </form>
      <div className="flex flex-col gap-4 p-2 md:flex-row">
        <ChangePasswordDialog />
        <ModalDeleteAccount />
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogTitle className="text-center">Welcome to Aquatechy!</DialogTitle>
          <DialogDescription className="text-center">
            Before start using the app, <b>you must complete</b> your profile.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
