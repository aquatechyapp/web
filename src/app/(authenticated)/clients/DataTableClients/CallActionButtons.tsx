import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import { Loader2Icon } from 'lucide-react';

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
import { useDeleteClient } from '@/hooks/react-query/clients/deleteClient';

interface ActionButtonsProps {
  client: Client;
}

export function ActionButtons({ client }: ActionButtonsProps) {
  const { push } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const { mutate: mutateDeleteClient } = useDeleteClient();

  const handleActionSelect = (action: 'view' | 'addPool' | 'delete') => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      switch (action) {
        case 'view':
          setIsNavigating(true);
          push(`/clients/${client.id}`);
          break;
        case 'addPool':
          push(`/clients/add-pool?clientId=${client.id}`);
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
            {isNavigating ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <BsThreeDotsVertical className="text-stone-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onSelect={() => handleActionSelect('view')}
            disabled={isNavigating}
          >
            {isNavigating ? (
              <div className="flex items-center gap-2">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              'View'
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleActionSelect('addPool')}
            disabled={isNavigating}
          >
            Add Pool
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleActionSelect('delete')} 
            className="text-red-500"
            disabled={isNavigating}
          >
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
    </div>
  );
}
