'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { InputFile } from '@/components/InputFile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Categories } from '@/constants';
import { useUserStore } from '@/store/user';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useCreateRequest } from '@/hooks/react-query/requests/createRequest';
import { Client } from '@/interfaces/Client';
import { isEmpty } from '@/utils';
import { buildSelectOptions } from '@/utils/formUtils';

const schema = z.object({
  clientId: z.string().min(1, { message: 'Client is required' }),
  addressedTo: z.string().min(1),
  poolId: z.string().min(1, { message: 'Pool is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  photo: z.array(z.any()),
  status: z.enum(['Pending', 'Processing', 'Done']),
  outcome: z.string().optional(),
  createdBy: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string()
  })
});

export function ModalAddRequest() {
  const [open, setOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const { mutate: createRequest, isPending: isPendingCreate } = useCreateRequest();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: '',
      category: '',
      createdBy: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName
      },
      addressedTo: user?.id,
      poolId: '',
      description: '',
      photo: [],
      status: 'Pending',
      outcome: undefined
    }
  });

  function handleSubmit(data) {
    if (isEmpty(form.formState.errors)) {
      createRequest(data);
      setOpen(false);
    }
  }

  const { data: clients, isLoading: isLoadingClients } = useGetClients();
  const isLoading = isLoadingClients || isPendingCreate;

  if (isLoading) return <LoadingSpinner />;

  const clientId = form.watch('clientId');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          Add request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <DialogTitle>New Request</DialogTitle>
            <div className="flex gap-4">
              <SelectField
                data={buildSelectOptions(
                  clients.filter((client: Client) => client.pools.length > 0),
                  {
                    key: 'id',
                    name: 'name',
                    value: 'id'
                  }
                )}
                placeholder={clients.length > 0 ? 'Clients' : 'No clients available'}
                form={form}
                name="clientId"
              />
              {clientId && (
                <SelectField
                  data={buildSelectOptions(
                    // Procura a piscina somente quando seleciona o cliente
                    clients?.find((client: Client) => client.id === clientId)?.pools,
                    {
                      key: 'id',
                      name: 'name',
                      value: 'id'
                    }
                  )}
                  placeholder="Pools"
                  form={form}
                  name="poolId"
                />
              )}
            </div>
            <div>
              <InputField form={form} name="description" placeholder="Description" type="textArea" label=" " />
            </div>
            <div>
              <div className="h-44">
                <InputFile
                  showIcon={false}
                  handleChange={(images) => form.setValue('photo', images)}
                  defaultPhotos={[]}
                />
              </div>
            </div>
            <SelectField form={form} name="category" data={Categories} placeholder="Category" />

            <Button className="w-full" type="submit">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
