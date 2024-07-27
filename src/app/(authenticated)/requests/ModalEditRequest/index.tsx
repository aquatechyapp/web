'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { FieldType } from '@/constants/enums';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useUpdateRequest } from '@/hooks/react-query/requests/updateRequest';
import { Client } from '@/interfaces/Client';
import { Request } from '@/interfaces/Request';
import { useUserStore } from '@/store/user';
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

export type EditRequest = z.infer<typeof schema>;

type Props = {
  request: Request;
};

export function ModalEditRequest({ request }: Props) {
  const [open, setOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const { mutate: updateRequest, isPending: isPendingUpdate } = useUpdateRequest(request.id);

  const CopyToClipboardData = [
    {
      value: request.client?.email || 'Email not available',
      Icon: IoMdMail
    },
    {
      value: request.client?.phone || 'Phone not available',
      Icon: MdOutlinePhoneAndroid
    }
  ];

  const form = useForm<EditRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: request.clientId || '',
      category: request.category || '',
      createdBy: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName
      },
      addressedTo: user?.id,
      poolId: request.poolId || '',
      description: request.description || '',
      photo: request.photos || [],
      status: request.status || 'Pending',
      outcome: request.outcome || undefined
    }
  });

  function handleSubmit(data: EditRequest) {
    if (isEmpty(form.formState.errors)) {
      updateRequest(data);
      setOpen(false);
    }
  }

  const { data: clients, isLoading: isLoadingClients } = useGetClients();
  const isLoading = isLoadingClients || isPendingUpdate;

  if (isLoading) return <LoadingSpinner />;

  const clientId = form.watch('clientId');
  const isOnlyDetailModal = !!request;
  const disabled = isOnlyDetailModal;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="font-semibold">
          See Details
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <DialogTitle className="font-semibold">{request ? `Request #${request.id}` : 'New Request'}</DialogTitle>
            <div className="flex gap-4">
              <SelectField
                options={buildSelectOptions(
                  clients?.filter((client: Client) => client.pools.length > 0),
                  {
                    key: 'id',
                    name: 'name',
                    value: 'id'
                  }
                )}
                placeholder={clients?.length || 0 > 0 ? 'Clients' : 'No clients available'}
                name="clientId"
                disabled={disabled}
                label="Client"
              />
              {clientId && (
                <SelectField
                  options={buildSelectOptions(
                    // Procura a piscina somente quando seleciona o cliente
                    clients?.find((client: Client) => client.id === clientId)?.pools,
                    {
                      key: 'id',
                      name: 'name',
                      value: 'id'
                    }
                  )}
                  placeholder="Pools"
                  name="poolId"
                  disabled={disabled}
                  label="Pool"
                />
              )}
            </div>
            <div>
              <InputField
                name="description"
                placeholder="Description"
                type={FieldType.TextArea}
                disabled={disabled}
                label="Description"
              />
            </div>
            <InputFile
              disabled={disabled}
              handleChange={(images) => form.setValue('photo', images)}
              defaultPhotos={request.photos.map((photo) => ({
                dataURL: photo,
                file: new File([], photo)
              }))}
              showBorder={false}
            />
            <SelectField
              label="Category"
              name="category"
              options={Categories}
              placeholder="Category"
              disabled={disabled}
            />
            <SelectField label="Status" name="status" options={RequestStatus} placeholder="Status" />

            <InputField
              label="Outcome (description of how the problem was fixed)"
              name="outcome"
              placeholder="Outcome"
              type={FieldType.TextArea}
            />
            <div>
              {CopyToClipboardData.map((item) => (
                <CopyToClipboard key={item.value} value={item.value} Icon={item.Icon} />
              ))}
            </div>
            <Button className="w-full" type="submit">
              Update Request
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
