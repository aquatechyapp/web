'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { isEmpty } from '@/utils';

import { useInviteMemberToACompany } from '@/hooks/react-query/companies/inviteMember';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { Company } from '@/ts/interfaces/Company';

const schema = z.object({
  companyId: z
    .string({
      required_error: 'companyId is required.',
      invalid_type_error: 'companyId must be a string.'
    })
    .trim()
    .min(1, { message: 'companyId must be at least 1 character.' }),
  userInvitedEmail: z
    .string({
      required_error: 'userInvitedEmail is required.',
      invalid_type_error: 'userInvitedEmail must be a string.'
    })
    .email({ message: 'Invalid e-mail.' }),
  role: z.enum(['Owner', 'Admin', 'Office', 'Technician', 'Cleaner'], {
    required_error: 'role is required.',
    invalid_type_error: "role must be 'Owner', 'Admin', 'Office', 'Technician', 'Cleaner'."
  })
});

export type CreateRequest = z.infer<typeof schema>;

export function ModalAddMember() {
  const [open, setOpen] = useState(false);
  const { mutate: inviteMember, isPending: isPendingCreate } = useInviteMemberToACompany();
  const { data: companies } = useGetCompanies();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      userInvitedEmail: '',
      companyId: '',
      role: 'Cleaner'
    }
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  function handleSubmit(data: z.infer<typeof schema>) {
    if (isEmpty(form.formState.errors)) {
      inviteMember(data);
      setOpen(false);
    } else {
      console.log('Errors', form.formState.errors);
    }
  }

  const isLoading = isPendingCreate;

  if (isLoading) return <LoadingSpinner />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          Add member
        </Button>
      </DialogTrigger>
      <DialogContent className="w-96 rounded-md md:w-[680px]">
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <DialogTitle>New member</DialogTitle>

            <div className="flex gap-4">
              <SelectField
                name="companyId"
                placeholder="Company"
                options={companies?.map((company: Company) => ({
                  key: company.id,
                  name: company.name,
                  value: company.id
                }))}
              />
            </div>
            <SelectField
              name="role"
              defaultValue="Member"
              placeholder="Select role"
              options={[
                {
                  key: 'Owner',
                  name: 'Owner',
                  value: 'Owner'
                },
                {
                  key: 'Admin',
                  name: 'Admin',
                  value: 'Admin'
                },
                {
                  key: 'Office',
                  name: 'Office',
                  value: 'Office'
                },
                {
                  key: 'Technician',
                  name: 'Technician',
                  value: 'Technician'
                },
                {
                  key: 'Cleaner',
                  name: 'Cleaner',
                  value: 'Cleaner'
                }
              ]}
            />
            <div className="flex gap-4">
              <InputField name="userInvitedEmail" placeholder="User e-mail" />
            </div>

            <Button className="w-full" type="submit">
              Add member
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
