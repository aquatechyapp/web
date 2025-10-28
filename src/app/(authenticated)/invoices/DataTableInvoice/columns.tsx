'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';
import { ActionButtons } from './CallActionButtons';

// Caso ainda não tenha o tipo, adicione provisoriamente:
export interface Invoice {
  id: string;
  amount: number;
  status: string;
  createdAt?: string;
  items?: { name: string; units: number; pricePerUnit: number }[];
  company?: { name: string };
  client?: { firstName: string; lastName: string };
}

const statusOptions: Record<string, { label: string; className: string }> = {
  Draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600' },
  Pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-600' },
  Paid: { label: 'Paid', className: 'bg-green-100 text-green-600' },
  Canceled: { label: 'Canceled', className: 'bg-red-100 text-red-600' }
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const c = row.original.client;
      return <span>{c ? `${c.firstName} ${c.lastName}` : '—'}</span>;
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <div>${row.original.amount.toFixed(2)}</div>
  },
  {
    accessorKey: 'items',
    header: 'Quantities',
    cell: ({ row }) => <div>{row.original.items?.length ?? 0}</div>
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) =>
      row.original.createdAt ? (
        <div>{format(new Date(row.original.createdAt), 'dd MMM yyyy')}</div>
      ) : (
        '—'
      )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = statusOptions[row.original.status] || {
        label: row.original.status,
        className: 'bg-gray-100 text-gray-600'
      };
      return (
        <div
          className={`rounded-md px-2 py-1 text-xs font-medium text-center ${status.className}`}
        >
          {status.label}
        </div>
      );
    }
  },
   {
     id: 'actions',
     cell: ({ row }) => <ActionButtons invoice={row.original} />
   },
];
