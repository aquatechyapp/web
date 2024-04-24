'use client';

import { Button } from '@/components/ui/button';
import { FaRegTrashAlt } from 'react-icons/fa';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import React, { useState } from 'react';
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
