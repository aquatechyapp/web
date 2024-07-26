import { CellContext } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Client } from '@/interfaces/Client';
import { getInitials } from '@/utils/others';

export default function NamePhoto(cell: CellContext<Client, unknown>) {
  const { name, email1 } = cell.row.original;

  return (
    <div className="flex">
      <Avatar>
        <AvatarImage src={''} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="ml-4 flex flex-col">
        <span>{name}</span>
        <span>{email1}</span>
      </div>
    </div>
  );
}
