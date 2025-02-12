'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoMdMail } from 'react-icons/io';
import { MdOutlinePhoneAndroid } from 'react-icons/md';
import { z } from 'zod';

import InputField from '@/components/InputField';
import { InputFile } from '@/components/InputFile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Categories, RequestStatus } from '@/constants';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useUpdateRequest } from '@/hooks/react-query/requests/updateRequest';
import { useUserStore } from '@/store/user';
import { FieldType } from '@/ts/enums/enums';
import { Client } from '@/ts/interfaces/Client';
import { Request } from '@/ts/interfaces/Request';
import { formatCamelCase, isEmpty } from '@/utils';
import { buildSelectOptions } from '@/utils/formUtils';

import { CopyToClipboard } from './CopyToClipboard';
import { Heading } from 'lucide-react';
import { Typography } from '@/components/Typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/others';
import { format } from 'date-fns';
import { useDeleteRequest } from '@/hooks/react-query/requests/deleteRequest';

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
export type DeleteRequest = {
  id: string;
};

type Props = {
  request: Request;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ModalEditRequest({ request, open, setOpen }: Props) {
  const user = useUserStore((state) => state.user);
  const { mutate: updateRequest, isPending: isPendingUpdate } = useUpdateRequest(request.id);
  const { mutate: deleteRequest, isPending: isPendingDelete } = useDeleteRequest(request.id);

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

  function handleDelete() {
    deleteRequest({ id: request.id });
    setOpen(false);
  }

  const isLoading = isPendingUpdate || isPendingDelete;

  if (isLoading) return <LoadingSpinner />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full p-0 lg:max-w-sm">
        <Form {...form}>
          <form className="w-full lg:max-w-sm" onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <div className="w-full lg:max-w-sm">
              <div className="relative flex w-full flex-col items-center justify-start gap-6 text-nowrap rounded-lg border px-6 pb-6 pt-8">
                <div className="flex w-full flex-col flex-wrap items-start justify-start gap-[4px] self-start lg:flex-col lg:flex-nowrap">
                  <div className="flex w-full flex-row flex-wrap items-start justify-start gap-[4px] self-start border-b border-gray-200 pb-4 lg:flex-col lg:flex-nowrap">
                    <div className="inline-flex w-fit items-start justify-start">
                      <div className="inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                        <div className="self-stretch text-sm font-medium text-gray-500">Client name</div>
                        <div className="self-stretch text-sm font-medium text-gray-800">{request.client.fullName}</div>
                      </div>
                    </div>
                    <div className="inline-flex w-fit items-start justify-start">
                      <div className="inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                        <div className="self-stretch text-sm font-medium text-gray-500">Email</div>
                        <div className="self-stretch text-sm font-medium text-gray-800">{request.client.email}</div>
                      </div>
                    </div>
                    <div className="inline-flex w-fit items-start justify-start">
                      <div className="inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                        <div className="self-stretch text-sm font-medium text-gray-500">Phone Number</div>
                        <div className="self-stretch text-sm font-medium text-gray-800">{request.client.phone}</div>
                      </div>
                    </div>
                    <div className="inline-flex w-fit items-start justify-start">
                      <div className="Text inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                        <div className="self-stretch text-sm font-medium text-gray-500">Location</div>
                        <div className="self-stretch text-sm font-medium text-gray-800">{request.pool.address}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-row flex-wrap items-start justify-start gap-[4px] self-start border-b border-gray-200 pb-4 lg:flex-col lg:flex-nowrap">
                    <div className="inline-flex w-fit items-start justify-start gap-2">
                      <div className="inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                        <div className="self-stretch text-sm font-medium text-gray-500">Opened</div>
                        <div className="self-stretch text-sm font-medium text-gray-800">
                          {format(new Date(request.createdAt), "MMMM, dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex w-fit items-start justify-start gap-2">
                      <div className="inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                        <div className="self-stretch text-sm font-medium text-gray-500">Category</div>
                        <div className="self-stretch text-sm font-medium text-gray-800">
                          {formatCamelCase(request.category)}
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex w-fit items-start justify-start gap-2">
                      <div className="inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                        <div className="self-stretch text-sm font-medium text-gray-500">Description</div>
                        <div className="self-stretch text-sm font-medium text-gray-800">{request.description}</div>
                      </div>
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                      <div className="self-stretch text-sm font-medium text-gray-500">Photos</div>
                      <div className="self-stretch text-sm font-bold text-gray-800">See photos</div>
                      {/* <div className="self-stretch text-sm font-medium text-gray-800">
                        <InputFile
                          disabled={disabled}
                          handleChange={(images) => form.setValue('photo', images)}
                          defaultPhotos={request.photos.map((photo) => ({
                            dataURL: photo,
                            file: new File([], photo)
                          }))}
                          showBorder={false}
                        />
                        </div> */}
                    </div>

                    <div className="inline-flex w-fit items-start justify-start gap-2">
                      <div className="inline-flex shrink grow basis-0 flex-row items-start justify-center gap-1">
                        <div className="self-stretch text-sm font-medium text-gray-500">Resolution</div>
                        <div className="self-stretch text-sm font-medium text-gray-800">
                          {request.outcome || 'No resolution yet'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex w-full flex-row flex-wrap items-start justify-start gap-[4px] self-start border-b border-gray-200 pb-4 lg:flex-col lg:flex-nowrap">
                    <InputField
                      name="outcome"
                      placeholder="How was the outcome?"
                      className="mb-2 w-full"
                      type={FieldType.TextArea}
                    />
                    <SelectField name="status" options={RequestStatus} placeholder="Status" />
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-2">
                  <div className="flex w-full justify-center gap-2">
                    <Button className="w-full" variant={'default'} type="submit">
                      Update
                    </Button>
                    <Button className="w-full" variant={'destructive'} type="button" onClick={() => handleDelete()}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
