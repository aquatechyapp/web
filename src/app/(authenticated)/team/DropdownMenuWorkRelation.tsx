'use client';

import { Button } from '../../../components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '../../../components/ui/dialog';
import React from 'react';
import { useDeleteRelation } from '../../../hooks/react-query/work-for-relations/useDeleteRelation';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

type Props = {
  workRelationId: string;
};

export default function DropdownMenuWorkRelation({ workRelationId }: Props) {
  const { isPending, mutate } = useDeleteRelation();

  const handleDelete = () => {
    mutate({ workRelationId });
  };

  if (isPending) return <LoadingSpinner />;

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="self-center absolute right-0 top-0"
          >
            <Button size="icon" variant="ghost">
              <BsThreeDotsVertical className="text-stone-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger asChild className="w-full">
              <DropdownMenuItem>
                <div className="text-red-500  flex items-center w-full">
                  Delete
                  <DropdownMenuShortcut>
                    <MdDeleteOutline size={14} />
                  </DropdownMenuShortcut>
                </div>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Once you remove the work relation, you will lose all the information
          </DialogDescription>
          <div className="flex justify-around">
            <DialogTrigger>
              <Button variant={'destructive'} onClick={handleDelete}>
                Delete
              </Button>
            </DialogTrigger>
            <DialogTrigger>
              <Button variant={'outline'}>Cancel</Button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
