'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { RecurringInvoiceTemplate } from '@/hooks/react-query/invoices/useGetRecurringInvoiceTemplates';
import { RecurringInvoiceActions } from './components/RecurringInvoiceActions';

const frequencyLabels: Record<RecurringInvoiceTemplate['frequency'], string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly'
};

const deliveryLabels: Record<RecurringInvoiceTemplate['delivery'], { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-600'
  },
  'auto-send': {
    label: 'Auto-send',
    className: 'bg-blue-100 text-blue-600'
  }
};

export const createColumns = (
  onView?: (template: RecurringInvoiceTemplate) => void,
  onEdit?: (template: RecurringInvoiceTemplate) => void,
  onDelete?: (template: RecurringInvoiceTemplate) => void
): ColumnDef<RecurringInvoiceTemplate>[] => [
  {
    accessorKey: 'referenceNumber',
    header: 'Reference Number',
    cell: ({ row }) => (
      <div className="font-semibold text-gray-900">
        {row.original.referenceNumber || '-'}
      </div>
    ),
    enableGlobalFilter: true
  },
  {
    accessorKey: 'clientName',
    header: 'Client',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.original.clientName || 'N/A'}</div>
        {row.original.poolId && (
          <div className="mt-0.5 text-xs text-gray-500">Pool: {row.original.poolId}</div>
        )}
      </div>
    ),
    enableGlobalFilter: true,
    filterFn: (row, _, filter) => {
      if (filter === 'all' || filter === '' || !filter) {
        return true;
      }
      return row.original.clientId === filter;
    }
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => (
      <div className="text-gray-700">
        {format(new Date(row.original.startDate), 'MMM dd, yyyy')}
      </div>
    )
  },
  {
    accessorKey: 'frequency',
    header: 'Frequency',
    cell: ({ row }) => (
      <div className="text-gray-700">
        {frequencyLabels[row.original.frequency] || row.original.frequency}
      </div>
    ),
    filterFn: (row, _, filter) => {
      if (filter === 'all' || filter === '' || !filter) {
        return true;
      }
      return row.original.frequency === filter;
    }
  },
  {
    accessorKey: 'delivery',
    header: 'Delivery',
    cell: ({ row }) => {
      const deliveryConfig = deliveryLabels[row.original.delivery] || { 
        className: 'bg-gray-100 text-gray-600',
        label: row.original.delivery 
      };
      return (
        <div
          className={`inline-flex max-w-28 items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold ${deliveryConfig.className}`}
        >
          {deliveryConfig.label}
        </div>
      );
    },
    filterFn: (row, _, filter) => {
      if (filter === 'all' || filter === '' || !filter) {
        return true;
      }
      return row.original.delivery === filter;
    }
  },
  {
    accessorKey: 'paymentTerms',
    header: 'Payment Terms',
    cell: ({ row }) => (
      <div className="text-gray-700">
        Net {row.original.paymentTerms} days
      </div>
    )
  },
  {
    accessorKey: 'total',
    header: 'Total Amount',
    cell: ({ row }) => (
      <div className="font-semibold text-gray-900">
        ${(row.original.total || 0).toFixed(2)}
      </div>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <RecurringInvoiceActions
        template={row.original}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }
];

