import { CellContext } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Client } from '@/interfaces/Client';
import { getInitials } from '@/utils/others';

export default function NamePhoto(cell: CellContext<Client, unknown>) {
  const { fullName, email } = cell.row.original;

  return (
    <div className="flex">
      <Avatar>
        <AvatarImage src={''} />
        <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
      </Avatar>
      <div className="ml-4 flex flex-col">
        <span>{fullName}</span>
        <span>{email}</span>
      </div>
    </div>
  );
}
