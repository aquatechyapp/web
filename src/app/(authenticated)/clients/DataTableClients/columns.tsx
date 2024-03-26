'use client';

import { Client } from '@/constants/interfaces';
import { ColumnDef } from '@tanstack/react-table';
import NamePhoto from './cell-name-photo';
import Phones from './cell-phone';
import ActionButtons from './cell-action-buttons';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (props) => <NamePhoto {...props} />
  },
  {
    accessorKey: 'phone1' || 'phone2',
    header: 'Phone',
    cell: (props) => <Phones {...props} />
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: (props) => {
      return (
        <div className="">
          {props.row.original.city}, {props.row.original.address}
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: (props) => <ActionButtons {...props} />
  },
  {
    id: 'deactivatedAt',
    accessorKey: 'deactivatedAt',
    filterFn: 'deactivatedAt'
  }
];
