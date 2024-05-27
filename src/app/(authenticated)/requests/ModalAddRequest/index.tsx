'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdMail } from 'react-icons/io';
import { MdOutlinePhoneAndroid } from 'react-icons/md';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { InputFile } from '@/components/InputFile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Categories, RequestStatus } from '@/constants';
import { useUserContext } from '@/context/user';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useCreateRequest } from '@/hooks/react-query/requests/createRequest';
import { useUpdateRequest } from '@/hooks/react-query/requests/updateRequest';
import { Client } from '@/interfaces/Client';
import { Request } from '@/interfaces/Request';
import { isEmpty } from '@/utils';
import { buildSelectOptions } from '@/utils/formUtils';

import { CopyToClipboard } from './CopyToClipboard';

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

type Props = {
  request?: Request;
};

export function ModalAddRequest({ request }: Props) {
  const [open, setOpen] = useState(false);
  const { user } = useUserContext();
  const { mutate: createRequest, isPending: isPendingCreate } = useCreateRequest();
  const { mutate: updateRequest, isPending: isPendingUpdate } = useUpdateRequest(request?.id);

  const CopyToClipboardData = [
    {
      value: request?.client?.email1 || 'Email not available',
      Icon: IoMdMail
    },
    {
      value: request?.client?.phone1 || 'Phone not available',
      Icon: MdOutlinePhoneAndroid
    }
  ];

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: request?.clientId || '',
      category: request?.category || '',
      createdBy: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName
      },
      addressedTo: user?.id,
      poolId: request?.poolId || '',
      description: request?.description || '',
      photo: request?.photo || [],
      status: request?.status || 'Pending',
      outcome: request?.outcome || undefined
    }
  });

  function handleSubmit(data) {
    if (isEmpty(form.formState.errors)) {
      isOnlyDetailModal ? updateRequest(data) : createRequest(data);
      setOpen(false);
    }
  }

  const { data: clients, isLoading: isLoadingClients } = useGetClients();
  const isLoading = isLoadingClients || isPendingCreate || isPendingUpdate;

  if (isLoading) return <LoadingSpinner />;

  const clientId = form.watch('clientId');
  const isOnlyDetailModal = !!request;
  const disabled = isOnlyDetailModal;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isOnlyDetailModal ? (
          <Button variant="link">Details</Button>
        ) : (
          <Button>
            <PlusIcon className="mr-2" />
            Add request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-screen">
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <DialogTitle>{request ? `Request #${request.id}` : 'New Request'}</DialogTitle>
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
                label="Client"
                placeholder={clients.length > 0 ? 'Client' : 'No clients available'}
                form={form}
                name="clientId"
                disabled={disabled}
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
                  placeholder="Pool"
                  form={form}
                  label="Pool"
                  name="poolId"
                  disabled={disabled}
                />
              )}
            </div>
            <div>
              <InputField
                form={form}
                name="description"
                placeholder="Description"
                type="textArea"
                disabled={disabled}
              />
            </div>
            <div>
              {isOnlyDetailModal ? (
                <InputFile
                  disabled={disabled}
                  handleChange={(images) => form.setValue('photo', images)}
                  defaultPhotos={request.photos.map((photo) => ({
                    dataURL: photo,
                    file: new File([], photo.url)
                  }))}
                />
              ) : (
                <InputFile handleChange={(images) => form.setValue('photo', images)} defaultPhotos={[]} />
              )}
            </div>
            {isOnlyDetailModal && <SelectField form={form} name="status" data={RequestStatus} placeholder="Status" />}
            <SelectField form={form} name="category" data={Categories} placeholder="Category" disabled={disabled} />
            {isOnlyDetailModal && <InputField form={form} name="outcome" placeholder="Outcome" type="textArea" />}
            {isOnlyDetailModal &&
              CopyToClipboardData.map((item) => (
                <CopyToClipboard key={item.value} value={item.value} Icon={item.Icon} />
              ))}
            {(form.formState.isDirty || !request) && (
              <Button className="w-full" type="submit">
                Save
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
