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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

import Image from 'next/image';

import { CopyToClipboard } from './CopyToClipboard';
import { Heading } from 'lucide-react';
import { Typography } from '@/components/Typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/others';
import { format } from 'date-fns';
import { useDeleteRequest } from '@/hooks/react-query/requests/deleteRequest';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { ListChecks, MapPin, User, FileText, ImageIcon, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

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
        id: request.createdByUser?.id,
        firstName: request.createdByUser?.firstName,
        lastName: request.createdByUser?.lastName
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
    // console.log('data', data);
    if (isEmpty(form.formState.errors)) {
      updateRequest(data);
      setOpen(false);
      // console.log('no errors');
    } else {
      console.log('errors', form.formState.errors);
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
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-[#364D9D]" />
            <DialogTitle className="text-xl font-semibold">Request Details</DialogTitle>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <div className="flex-1">
              {format(new Date(request.createdAt), "EEEE, MMMM do 'at' h:mm a")}
              <span className="ml-1 font-medium">
                by {request.createdByUser?.firstName} {request.createdByUser?.lastName}
              </span>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{request.pool.address}</span>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Accordion type="single" collapsible defaultValue="details" className="mt-4">
              <AccordionItem value="details">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#364D9D]" />
                    <span className="text-md">Client Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="text-sm text-gray-500">Client Name</div>
                        <div className="text-lg font-semibold">{request.client.fullName}</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-lg font-semibold">{request.client.email}</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="text-lg font-semibold">{request.client.phone}</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="text-sm text-gray-500">Category</div>
                        <div className="text-lg font-semibold">{formatCamelCase(request.category)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="request">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#364D9D]" />
                    <span className="text-md">Request Details</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="space-y-4 p-4">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="text-sm text-gray-500">Description</div>
                        <div className="text-lg">{request.description}</div>
                      </div>

                      <InputField
                        name="outcome"
                        placeholder="How was the outcome?"
                        className="w-full"
                        type={FieldType.TextArea}
                      />
                      <SelectField name="status" options={RequestStatus} placeholder="Status" />
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              {request.photos.length > 0 && (
                <AccordionItem value="photos">
                  <AccordionTrigger className="text-lg">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-[#364D9D]" />
                      <span className="text-md">Photos</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {request.photos.map((photo: string, index: number) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                          <Image
                            src={photo}
                            alt={`Request photo ${index + 1}`}
                            layout="fill"
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            <div className="mt-6 flex gap-2 border-t pt-6">
              <Button type="submit" className="w-full">
                Update Request
              </Button>
              <Button type="button" variant="destructive" className="w-full" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Request
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
