'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ActionButtons } from './callActionButtons';

// Caso ainda não tenha o tipo, adicione provisoriamente:
export interface Invoice {
  id: string;
  amount: number;
  paymentStatus: string;
  status:string;
  createdAt?: string;
  items?: { name: string; units: number; pricePerUnit: number }[];
  company?: { name: string };
  client?: { firstName: string; lastName: string };
}

const statusOptions: Record<string, { label: string; className: string }> = {
  overdue: { label: 'overdue', className: 'bg-gray-100 text-gray-600' },
  draft: { label: 'draft', className: 'bg-yellow-100 text-yellow-600' },
  paid: { label: 'paid', className: 'bg-green-100 text-green-600' },
  sent: { label: 'sent', className: 'bg-blue-100 text-blue-600' },
  cancelled: { label: 'cancelled', className: 'bg-red-100 text-red-600' },
  void: { label: 'void', className: 'bg-purple-100 text-purple-600' }
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
    cell: ({ row: { original } }) => (
      <div>
        {original.createdAt ? format(new Date(original.createdAt), "EEEE, MMMM do 'at' h:mm a") : 'N/A'}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-center w-full">Status</div>,
    cell: ({ row }) => {
      const key = String(row.original.status || '').toLowerCase();

      const status = statusOptions[key] || {
        label: row.original.status || '—',
        className: 'bg-gray-100 text-gray-600',
      };

      return (
        <div className="flex justify-center">
          <div
            className={`rounded-md px-2 py-1 text-xs font-medium text-center ${status.className}`}
          >
            {status.label}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ActionButtons invoice={row.original} />
      </div>
    ),
  }
];
