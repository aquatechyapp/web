'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Client } from '@/ts/interfaces/Client';

import ActionButtons from './CallActionButtons';
import NamePhoto from './CellNamePhoto';
import Phones from './CellPhone';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
    cell: (props) => <NamePhoto {...props} />,
    filterFn: 'includesString'
  },
  {
    accessorKey: 'type',
    header: '',
    cell: '',
    filterFn: (row, _, filter) => {
      if (filter === 'all') {
        return true;
      }
      return row.original.type.toLowerCase().includes(filter.toLowerCase());
    }
  },
  {
    accessorKey: 'phone',
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
    },
    filterFn: (row, _, filter) => {
      if (filter === 'all') {
        return true;
      }
      return row.original.city.toLowerCase().includes(filter.toLowerCase());
    }
  },
  {
    id: 'actions',
    cell: (props) => <ActionButtons {...props} />
  },
  {
    id: 'deactivatedAt',
    accessorKey: 'deactivatedAt',
    filterFn: (row, _, filter) => {
      if (filter === 'all') {
        return true;
      }
      if (filter === 'active') {
        return row.original.isActive;
      }
      if (filter === 'inactive') {
        return !row.original.isActive;
      }
      return true;
    }
  }
];
