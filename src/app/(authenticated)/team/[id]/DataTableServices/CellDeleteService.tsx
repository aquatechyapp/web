'use client';

import React, { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeleteService } from '@/hooks/react-query/services/deleteService';

type Props = {
  handleDelete: () => void;
};

const ModalDeleteService = ({ handleDelete }: Props) => {
  return (
    <DialogContent>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>Once you delete service, you will lose all the information related</DialogDescription>
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
          <Button size={'icon'} variant={'destructive'} onClick={() => setOpen(true)}>
            <FaRegTrashAlt />
          </Button>
        </DialogTrigger>
        <ModalDeleteService handleDelete={() => deleteService({ serviceId, assignmentId })} />
      </Dialog>
    </>
  );
}
