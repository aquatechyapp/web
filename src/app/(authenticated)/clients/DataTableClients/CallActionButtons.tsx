import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import { Client } from '@/ts/interfaces/Client';
import { ModalDeleteClient } from './ModalDeleteClient';
import { ModalAddPool } from './ModalAddPool';
import { useDeleteClient } from '@/hooks/react-query/clients/deleteClient';
import { useAddPoolToClient } from '@/hooks/react-query/clients/addPoolToClient';

interface ActionButtonsProps {
  client: Client;
}

export function ActionButtons({ client }: ActionButtonsProps) {
  const { push } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddPoolModalOpen, setIsAddPoolModalOpen] = useState(false);

  const { mutate: mutateDeleteClient } = useDeleteClient();
  const { mutate: mutateAddPool } = useAddPoolToClient();

  const handleActionSelect = (action: 'view' | 'addPool' | 'delete') => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      switch (action) {
        case 'view':
          push(`/clients/${client.id}`);
          break;
        case 'addPool':
          setIsAddPoolModalOpen(true);
          break;
        case 'delete':
          setIsDeleteModalOpen(true);
          break;
      }
    }, 0);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  return (
    <div onClick={handleDropdownClick}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleDropdownClick}>
            <BsThreeDotsVertical className="text-stone-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleActionSelect('view')}>View</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleActionSelect('addPool')}>Add Pool</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleActionSelect('delete')} className="text-red-500">
            <div className="flex w-full items-center">
              Delete
              <DropdownMenuShortcut>
                <MdDeleteOutline size={14} />
              </DropdownMenuShortcut>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalDeleteClient
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          handleSubmit={() => mutateDeleteClient(client.id)}
        />
      </Dialog>

      <Dialog open={isAddPoolModalOpen} onOpenChange={setIsAddPoolModalOpen}>
        <ModalAddPool
          open={isAddPoolModalOpen}
          setOpen={setIsAddPoolModalOpen}
          handleAddPool={mutateAddPool}
          clientOwnerId={client.id}
        />
      </Dialog>
    </div>
  );
}
