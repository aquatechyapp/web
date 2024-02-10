'use client';

import { Client } from '@/constants/interfaces';
import { ColumnDef } from '@tanstack/react-table';
import CellActionButtons from './cell-action-buttons';
import NamePhoto from './cell-name-photo';
import ActionButtons from './cell-action-buttons';
import Phones from './cell-phone';

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
    header: 'Address'
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: (props) => <ActionButtons {...props} />
  }
];
