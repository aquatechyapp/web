'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { AddressInput } from '@/components/AddressInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetCompany from '@/hooks/react-query/companies/getCompany';
import { useInviteMemberToACompany } from '@/hooks/react-query/companies/inviteMember';
import { Company } from '@/ts/interfaces/Company';
import { FieldType, IanaTimeZones } from '@/ts/enums/enums';

const existingUserSchema = z.object({
  companyId: z.string().min(1, { message: 'Company must be selected.' }),
  email: z.string().email({ message: 'Invalid email format.' }),
  role: z.enum(['Admin', 'Office', 'Technician', 'Cleaner'])
});

const newUserSchema = existingUserSchema.extend({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  company: z.string().min(1, { message: 'Company is required.' }),
  phone: z.string().min(1, { message: 'Phone is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  state: z.string().min(1, { message: 'State is required.' }),
  zip: z.string().min(1, { message: 'ZIP code is required.' }),
  addressLine2: z.optional(z.string().trim())
});

function isValidObjectId(id: string): boolean {
  const objectIdRegex = /^[a-fA-F0-9]{24}$/;
  return objectIdRegex.test(id);
}

type Props = {
  params: { id: string };
};

export default function AddMemberPage({ params: { id } }: Props) {
  if (!id || !isValidObjectId(id)) {
    notFound();
  }

  const router = useRouter();
  const { mutate: inviteMember, isPending } = useInviteMemberToACompany();
  const { data: company, isLoading: isCompanyLoading } = useGetCompany(id);

  const [step, setStep] = useState<null | 'existing' | 'new'>(null);

  const redirectAfterInvite = () => {
    router.push(`/settings/companies/team/${id}`);
  };

  const existingUserForm = useForm<z.infer<typeof existingUserSchema>>({
    resolver: zodResolver(existingUserSchema),
    defaultValues: {
      companyId: id,
      email: '',
      role: 'Cleaner'
    }
  });

  const newUserForm = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      companyId: id,
      email: '',
      role: 'Cleaner',
      firstName: '',
      lastName: '',
      company: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      addressLine2: ''
    }
  });

  useEffect(() => {
    existingUserForm.setValue('companyId', id);
    newUserForm.setValue('companyId', id);
  }, [id, existingUserForm, newUserForm]);

  useEffect(() => {
    const c = company as Company | undefined;
    if (c?.name && newUserForm.getValues('company') === '') {
      newUserForm.setValue('company', c.name);
    }
  }, [company, newUserForm]);

  const handleAddressSelect = (address: {
    fullAddress: string;
    state: string;
    city: string;
    zipCode: string;
    timezone: IanaTimeZones;
    addressLine2?: string;
  }) => {
    newUserForm.setValue('address', address.fullAddress);
    newUserForm.setValue('state', address.state);
    newUserForm.setValue('city', address.city);
    newUserForm.setValue('zip', address.zipCode);
    newUserForm.setValue('addressLine2', address.addressLine2);
  };

  function handleExistingUserSubmit(data: z.infer<typeof existingUserSchema>) {
    inviteMember(
      {
        userInvitedEmail: data.email,
        companyId: data.companyId,
        role: data.role,
        userAlreadyExists: true
      },
      {
        onSuccess: () => {
          redirectAfterInvite();
        }
      }
    );
  }

  function handleNewUserSubmit(data: z.infer<typeof newUserSchema>) {
    inviteMember(
      {
        userInvitedEmail: data.email,
        companyId: data.companyId,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        userAlreadyExists: false,
        addressLine2: data.addressLine2 || ''
      },
      {
        onSuccess: () => {
          redirectAfterInvite();
        }
      }
    );
  }

  const handleBack = () => setStep(null);

  const companyName = (company as Company | undefined)?.name ?? '';

  if (isCompanyLoading) {
    return <LoadingSpinner />;
  }

  if (!step) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-5 lg:p-8">
        <div className="mb-6 w-full max-w-md self-start">
          <Button variant="ghost" className="gap-2" onClick={() => router.push(`/settings/companies/team/${id}`)}>
            <ArrowLeftIcon className="h-4 w-4" />
            Back to company
          </Button>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Add New Member
          {companyName ? (
            <span className="mt-2 block text-lg font-medium text-gray-600">{companyName}</span>
          ) : null}
        </h1>
        <div className="mt-6 flex w-full max-w-md flex-col gap-4">
          <Button
            className="min-h-[3rem] w-full py-4 text-center md:min-h-auto md:py-2"
            onClick={() => setStep('new')}
          >
            The user is new on Aquatechy
          </Button>
          <Button
            className="min-h-[3rem] w-full py-4 text-center md:min-h-auto md:py-2"
            variant="outline"
            onClick={() => setStep('existing')}
          >
            The user already has an account on Aquatechy
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'existing') {
    return (
      <div className="w-full p-5 lg:p-8">
        <div
          className="mb-6 flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-gray-50"
          onClick={handleBack}
        >
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-normal text-gray-600">Back</span>
        </div>
        <div className="mx-auto w-full">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">Invite Existing User</h1>
          <Form {...existingUserForm}>
            <form onSubmit={existingUserForm.handleSubmit(handleExistingUserSubmit)} className="space-y-6">
              <input type="hidden" {...existingUserForm.register('companyId')} />
              <InputField name="email" label="User E-mail" placeholder="Enter user e-mail" />
              <SelectField
                name="role"
                label="Role"
                placeholder="Select role"
                options={[
                  { key: 'Admin', name: 'Admin', value: 'Admin' },
                  { key: 'Office', name: 'Office', value: 'Office' },
                  { key: 'Technician', name: 'Technician', value: 'Technician' },
                  { key: 'Cleaner', name: 'Cleaner', value: 'Cleaner' }
                ]}
              />
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Inviting...' : 'Invite Member'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-5 lg:p-8">
      <div
        className="mb-6 flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-gray-50"
        onClick={handleBack}
      >
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm font-normal text-gray-600">Back</span>
      </div>
      <div className="mx-auto w-full">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">Create and Invite New User</h1>
        <Form {...newUserForm}>
          <form onSubmit={newUserForm.handleSubmit(handleNewUserSubmit)} className="space-y-6">
            <input type="hidden" {...newUserForm.register('companyId')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InputField name="firstName" label="First Name" placeholder="Enter first name" />
              <InputField name="lastName" label="Last Name" placeholder="Enter last name" />
              <InputField name="company" label="Company" placeholder="Enter company name" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField name="email" label="Email" placeholder="Enter email address" />
              <InputField name="phone" label="Phone" placeholder="Enter phone number" type={FieldType.Phone} />
            </div>
            <div className="space-y-4">
              <AddressInput
                name="address"
                label="Address"
                placeholder="Enter address"
                onAddressSelect={handleAddressSelect}
              />
              <InputField name="addressLine2" label="Address Line 2" placeholder="Apt, suite, unit" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <InputField name="state" label="State" placeholder="State" />
                <InputField name="city" label="City" placeholder="City" />
                <InputField name="zip" label="ZIP Code" placeholder="ZIP code" />
              </div>
            </div>
            <SelectField
              name="role"
              label="Role"
              placeholder="Select role"
              options={[
                { key: 'Admin', name: 'Admin', value: 'Admin' },
                { key: 'Office', name: 'Office', value: 'Office' },
                { key: 'Technician', name: 'Technician', value: 'Technician' },
                { key: 'Cleaner', name: 'Cleaner', value: 'Cleaner' }
              ]}
            />
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={handleBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Inviting...' : 'Invite Member'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
