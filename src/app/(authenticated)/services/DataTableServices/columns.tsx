'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Services } from '@/ts/interfaces/Request';
import { ServiceStatus } from '@/ts/interfaces/Service';

const statusOptions: Record<ServiceStatus, { label: string; className: string }> = {
  Open: {
    label: 'Open',
    className: 'bg-red-100 text-red-600'
  },
  InProgress: {
    label: 'In progress',
    className: 'bg-yellow-100 text-yellow-600'
  },
  Skipped: {
    label: 'Skipped',
    className: 'bg-gray-100 text-gray-600'
  },
  Completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-600'
  }
};

export const columns: ColumnDef<Services>[] = [
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row: { original } }) => (
      <>
        <div>
          {original.pool.clientOwner!.firstName} {original.pool.clientOwner!.lastName}
        </div>
        <div>
          {original.pool.zip}, {original.pool.state},{original.pool.city}, {original.pool.address}
        </div>
      </>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row: { original } }) => <div>{new Date(original.completedAt!).toLocaleDateString()}</div>
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row: { original } }) => <div>{'N/A'}</div>
  },
  {
    accessorKey: 'memberId',
    header: 'Member',
    cell: ({ row: { original } }) => (
      <div>
        {original.completedByUser?.firstName} {original.completedByUser?.lastName}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row: { original } }) => {
      return (
        <div
          className={`max-w-28 rounded-lg px-2 py-2 text-center font-semibold ${statusOptions[original.status].className}`}
        >
          {original.status}
        </div>
      );
    }
  },
  // Implementar Delete
  // {
  //   id: 'actions',
  //   cell: ({ row: { original } }) => {
  //     return ;
  //   }
  // },
  {
    id: 'createdAt',
    filterFn: (row, columnId, value) => {
      let date: string | Date = row.original.createdAt;

      const [start, end] = value; // value => two date input values
      //If one filter defined and date is null filter it
      if ((start || end) && !date) return false;
      // vem do back como string
      if (typeof date === 'string') date = new Date(date);
      if (start && !end) {
        return date.getTime() >= start.getTime();
      } else if (!start && end) {
        return date.getTime() <= end.getTime();
      } else if (start && end) {
        return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
      } else return true;
    }
  }
];
