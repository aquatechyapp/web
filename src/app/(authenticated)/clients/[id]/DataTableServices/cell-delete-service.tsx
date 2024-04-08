'use client';

import { Button } from '@/app/_components/ui/button';
import { useToast } from '@/app/_components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/app/_components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { useDeleteClient } from '@/hooks/react-query/clients/deleteClient';
import { useAddPoolToClient } from '@/hooks/react-query/clients/addPoolToClient';
import { ModalAddPool } from './modal-add-pool';
import { useDeleteService } from '@/hooks/react-query/pools/deleteService';

const ModalDeleteService = ({ handleDelete }) => {
  return (
    <DialogContent>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        Once you delete service, you will lose all the information related
      </DialogDescription>
      <div className="flex justify-around">
        <DialogTrigger asChild>
          <Button variant={'destructive'} onClick={handleDelete}>
            Delete
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button variant={'outline'}>Cancel</Button>
        </DialogTrigger>
      </div>
    </DialogContent>
  );
};

export default function CellDeleteService({ ...props }) {
  const [open, setOpen] = useState(false);

  const serviceId = props.row.original.id;
  const assignmentId = props.row.original.assignmentId;

  const { mutate: deleteService } = useDeleteService();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size={'icon'}
            variant={'destructive'}
            onClick={() => setOpen(true)}
          >
            <FaRegTrashAlt />
          </Button>
        </DialogTrigger>
        <ModalDeleteService
          handleDelete={() => deleteService({ serviceId, assignmentId })}
        />
      </Dialog>
    </>
  );
}
