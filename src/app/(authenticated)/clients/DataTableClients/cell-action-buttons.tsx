'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAddPoolToClient } from '@/hooks/react-query/clients/addPoolToClient';
import { useDeleteClient } from '@/hooks/react-query/clients/deleteClient';

import { ModalAddPool } from './modal-add-pool';

type Props = {
  clientOwnerId: string;
};

const ModalDeleteClient = ({ clientOwnerId }: Props) => {
  const { mutate: mutateDeleteClient } = useDeleteClient();

  return (
    <DialogContent>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>Once you delete the client, you will lose all the information related</DialogDescription>
      <div className="flex justify-around">
        <DialogTrigger>
          <Button variant={'destructive'} onClick={() => mutateDeleteClient(clientOwnerId)}>
            Delete
          </Button>
        </DialogTrigger>
        <DialogTrigger>
          <Button variant={'outline'}>Cancel</Button>
        </DialogTrigger>
      </div>
    </DialogContent>
  );
};

export default function ActionButtons({ ...props }) {
  const { push } = useRouter();
  const [modalType, setModalType] = useState('');
  const [open, setOpen] = useState(false);

  const clientOwnerId = props.row.original.id;

  const { mutate: mutateAddPool } = useAddPoolToClient();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="self-center">
            <Button size="icon" variant="ghost">
              <BsThreeDotsVertical className="text-stone-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => push(`/clients/${props.row.original.id}`)}>View</DropdownMenuItem>
            <DialogTrigger asChild className="w-full">
              <DropdownMenuItem onClick={() => setModalType('ModalAddPool')}>Add Pool</DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild className="w-full">
              <DropdownMenuItem onClick={() => setModalType('ModalDeleteClient')}>
                <div className="flex  w-full items-center text-red-500">
                  Delete
                  <DropdownMenuShortcut>
                    <MdDeleteOutline size={14} />
                  </DropdownMenuShortcut>
                </div>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        {modalType === 'ModalDeleteClient' ? (
          <ModalDeleteClient clientOwnerId={clientOwnerId} />
        ) : (
          <ModalAddPool open={open} setOpen={setOpen} handleAddPool={mutateAddPool} clientOwnerId={clientOwnerId} />
        )}
      </Dialog>
    </>
  );
}
