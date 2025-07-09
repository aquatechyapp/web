import { CellContext } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Client } from '@/ts/interfaces/Client';
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
        <span>{fullName} {!cell.row.original.isActive ? <span className="text-red-500">Inactive</span> : ''}</span>
        <span>{email}</span>
      </div>
    </div>
  );
}
