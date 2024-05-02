import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '../../../components/ui/dialog';
import { useDeleteRelation } from '../../../hooks/react-query/work-for-relations/useDeleteRelation';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ModalEdit } from './ModalEdit';

type Props = {
  workRelationId: string;
};

export default function DropdownMenuWorkRelation({ workRelationId }: Props) {
  const { isPending, mutate } = useDeleteRelation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    mutate({ workRelationId });
  };

  const handleEdit = () => {
    setIsEditModalOpen(true); // Define o estado como true para abrir o modal de edição
    console.log('Edit action triggered for work relation ID:', workRelationId);
  };

  if (isPending) return <LoadingSpinner />;

  return (
    <>
      <Dialog>
        <DropdownMenu>

          <DropdownMenuTrigger
            asChild
            className="self-center absolute right-0 top-0">
            <Button size="icon" variant="ghost">
              <BsThreeDotsVertical className="text-stone-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <ModalEdit workRelationId={workRelationId}>
              <div
                className="text-gray-700 flex items-center w-full p-1 hover:bg-blue-50 rounded">
                Edit
                <DropdownMenuShortcut>
                  <MdEdit className="ml-1" />
                </DropdownMenuShortcut>
              </div>
            </ModalEdit>
            <DialogTrigger asChild>
              <div className="text-red-500  flex items-center w-full p-1 hover:bg-blue-50 rounded">
                Delete
                <DropdownMenuShortcut>
                  <MdDeleteOutline size={14} />
                </DropdownMenuShortcut>
              </div>

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
