'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Client } from '@/interfaces/Client';

import ActionButtons from './cell-action-buttons';
import NamePhoto from './cell-name-photo';
import Phones from './cell-phone';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (props) => <NamePhoto {...props} />
  },
  {
    accessorKey: 'type',
    header: '',
    cell: ''
  },
  {
    accessorKey: 'phone1' || 'phone2',
    header: 'Phone',
    cell: (props) => <Phones {...props} />
  },
  {
    accessorKey: 'city',
    header: 'Address',
    cell: (props) => {
      return (
        <div className="">
          {props.row.original.city}, {props.row.original.address}, {props.row.original.state}, {props.row.original.zip}.
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
