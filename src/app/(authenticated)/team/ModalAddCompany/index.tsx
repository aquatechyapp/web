'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { isEmpty } from '@/utils';
import { useCreateCompany } from '@/hooks/react-query/companies/createCompany';

const schema = z.object({
  name: z
    .string({
      required_error: 'name is required.',
      invalid_type_error: 'name must be a string.'
    })
    .trim()
    .min(1, { message: 'name must be at least 1 character.' }),
  email: z
    .string({
      required_error: 'email is required.',
      invalid_type_error: 'email must be a string.'
    })
    .email({ message: 'Invalid e-mail.' }),
  phone: z
    .string({
      required_error: 'Phone is required.',
      invalid_type_error: 'Phone must be a string.'
    })
    .trim()
    .min(1, { message: 'phone1 must be at least 1 character.' }),
  address: z
    .string({
      required_error: 'address is required.',
      invalid_type_error: 'address must be a string.'
    })
    .trim()
    .min(1, { message: 'address must be at least 1 character.' }),
  city: z
    .string({
      required_error: 'city is required.',
      invalid_type_error: 'city must be a string.'
    })
    .trim()
    .min(1, { message: 'city must be at least 1 character.' }),
  state: z
    .string({
      required_error: 'state is required.',
      invalid_type_error: 'state must be a string.'
    })
    .trim()
    .min(1, { message: 'state must be at least 1 character.' }),
  zip: z
    .string({
      required_error: 'zip is required.',
      invalid_type_error: 'zip must be a string.'
    })
    .trim()
    .min(1, { message: 'zip must be at least 1 character.' })
});

export type CreateRequest = z.infer<typeof schema>;

export function ModalAddCompany() {
  const [open, setOpen] = useState(false);
  const { mutate: createCompany, isPending: isPendingCreate } = useCreateCompany();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  useEffect(() => {
    form.reset();
  }, [open]);

  function handleSubmit(data: z.infer<typeof schema>) {
    if (isEmpty(form.formState.errors)) {
      createCompany(data);
      setOpen(false);
    }
  }

  const isLoading = isPendingCreate;

  if (isLoading) return <LoadingSpinner />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          Create company
        </Button>
      </DialogTrigger>
      <DialogContent className="w-96 rounded-md md:w-[680px]">
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <DialogTitle>New company</DialogTitle>

            <div className="flex gap-4">
              <InputField name="name" placeholder="Name" />
            </div>
            <div className="flex gap-4">
              <InputField name="email" placeholder="Email" />
            </div>
            <div className="flex gap-4">
              <InputField name="phone" placeholder="Phone" />
            </div>
            <div className="flex gap-4">
              <InputField name="address" placeholder="Address" />
            </div>
            <div className="flex gap-4">
              <InputField name="city" placeholder="City" />
            </div>
            <div className="flex gap-4">
              <InputField name="state" placeholder="State" />
            </div>
            <div className="flex gap-4">
              <InputField name="zip" placeholder="Zip" />
            </div>

            <Button className="w-full" type="submit">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
