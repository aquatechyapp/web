'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { AddressInput } from '@/components/AddressInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

import { useInviteMemberToACompany } from '@/hooks/react-query/companies/inviteMember';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { Company } from '@/ts/interfaces/Company';
import { IanaTimeZones, FieldType } from '@/ts/enums/enums';

// Schemas
const existingUserSchema = z.object({
  companyId: z.string().min(1, { message: 'Company must be selected.' }),
  email: z.string().email({ message: 'Invalid email format.' }),
  role: z.enum(['Owner', 'Admin', 'Office', 'Technician', 'Cleaner'])
});

const newUserSchema = existingUserSchema.extend({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  company: z.string().min(1, { message: 'Company is required.' }),
  phone: z.string().min(1, { message: 'Phone is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  state: z.string().min(1, { message: 'State is required.' }),
  zip: z.string().min(1, { message: 'ZIP code is required.' })
});

export default function AddMemberPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: inviteMember, isPending } = useInviteMemberToACompany();
  const { data: companies } = useGetCompanies();

  // Step state
  const [step, setStep] = useState<null | 'existing' | 'new'>(null);

  // Forms
  const existingUserForm = useForm<z.infer<typeof existingUserSchema>>({
    resolver: zodResolver(existingUserSchema),
    defaultValues: {
      companyId: '',
      email: '',
      role: 'Cleaner'
    }
  });

  const newUserForm = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      companyId: '',
      email: '',
      role: 'Cleaner',
      firstName: '',
      lastName: '',
      company: '', // Add company default value
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  // Address handler for new user
  const handleAddressSelect = (address: {
    fullAddress: string;
    state: string;
    city: string;
    zipCode: string;
    timezone: IanaTimeZones;
  }) => {
    newUserForm.setValue('address', address.fullAddress);
    newUserForm.setValue('state', address.state);
    newUserForm.setValue('city', address.city);
    newUserForm.setValue('zip', address.zipCode);
  };

  // Submit handlers
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
          toast({
            variant: 'success',
            title: 'Member invited successfully',
            description: 'The member will receive an invitation email.'
          });
          router.push('/team');
        }
      }
    );
  }

  function handleNewUserSubmit(data: z.infer<typeof newUserSchema>) {
    // Send all the data including the company field
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
        userAlreadyExists: false
      },
      {
        onSuccess: () => {
          toast({
            variant: 'success',
            title: 'Member invited successfully',
            description: 'The member will receive an invitation email.'
          });
          router.push('/team');
        }
      }
    );
  }

  // UI
  if (!step) {
    return (
      <div className="w-full p-5 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Add New Member
        </h1>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            className="w-full py-4 min-h-[3rem] text-center md:py-2 md:min-h-auto"
            onClick={() => setStep('new')}
          >
            The user is new on Aquatechy
          </Button>

          <Button
            className="w-full py-4 min-h-[3rem] text-center md:py-2 md:min-h-auto"
            variant="outline"
            onClick={() => setStep('existing')}
          >
            The user already has an account on Aquatechy
          </Button>
        </div>

      </div>

    );
  }

  // Back button handler
  const handleBack = () => setStep(null);

  // Existing user form
  if (step === 'existing') {
    return (
      <div className="w-full p-5 lg:p-8">
        <div
          className="mb-6 flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={handleBack}
        >
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-normal text-gray-600">Back</span>
        </div>
        <div className="mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Invite Existing User</h1>
          <Form {...existingUserForm}>
            <form onSubmit={existingUserForm.handleSubmit(handleExistingUserSubmit)} className="space-y-6">
              <SelectField
                name="companyId"
                label="Company"
                placeholder="Select company"
                options={companies?.map((company: Company) => ({
                  key: company.id,
                  name: company.name,
                  value: company.id
                })) || []}
              />
              <InputField
                name="email"
                label="User E-mail"
                placeholder="Enter user e-mail"
              />
              <SelectField
                name="role"
                label="Role"
                placeholder="Select role"
                options={[
                  { key: 'Owner', name: 'Owner', value: 'Owner' },
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

  // New user form
  return (
    <div className="w-full p-5 lg:p-8">
      <div
        className="mb-6 flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        onClick={handleBack}
      >
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm font-normal text-gray-600">Back</span>
      </div>
      <div className="mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Create and Invite New User</h1>
        <Form {...newUserForm}>
          <form onSubmit={newUserForm.handleSubmit(handleNewUserSubmit)} className="space-y-6">
            <SelectField
              name="companyId"
              label="Company"
              placeholder="Select company"
              options={companies?.map((company: Company) => ({
                key: company.id,
                name: company.name,
                value: company.id
              })) || []}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InputField name="firstName" label="First Name" placeholder="Enter first name" />
              <InputField name="lastName" label="Last Name" placeholder="Enter last name" />
              <InputField
                name="company"
                label="Company"
                placeholder="Enter company name"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                name="email"
                label="Email"
                placeholder="Enter email address"
              />
              <InputField
                name="phone"
                label="Phone"
                placeholder="Enter phone number"
                type={FieldType.Phone}
              />
            </div>
            <div className="space-y-4">
              <AddressInput
                name="address"
                label="Address"
                placeholder="Enter address"
                onAddressSelect={handleAddressSelect}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <InputField name="state" label="State" placeholder="State" disabled />
                <InputField name="city" label="City" placeholder="City" disabled />
                <InputField name="zip" label="ZIP Code" placeholder="ZIP code" disabled />
              </div>
            </div>
            <SelectField
              name="role"
              label="Role"
              placeholder="Select role"
              options={[
                { key: 'Owner', name: 'Owner', value: 'Owner' },
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
