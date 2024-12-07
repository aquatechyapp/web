'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Services } from '@/ts/interfaces/Request';

const statusOptions = {
  Pending: {
    label: 'Pending',
    className: 'bg-red-100 text-red-600'
  },
  Processing: {
    label: 'Processing',
    className: 'bg-yellow-100 text-yellow-600'
  },
  Done: {
    label: 'Done',
    className: 'bg-green-100 text-green-600'
  }
};

export const columns: ColumnDef<Services>[] = [
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row: { original } }) => <div>{'N/A'}</div>
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row: { original } }) => <div>{new Date(original.createdAt).toLocaleDateString()}</div>
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row: { original } }) => <div>{'N/A'}</div>
  },
  {
    accessorKey: 'technician',
    header: 'Technician',
    cell: ({ row: { original } }) => (
      <div>
        {' '}
        {original.doneByUser?.firstName} {original.doneByUser?.lastName}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row: { original } }) => {
      return (
        <div
          className={`max-w-28 rounded-lg px-1 px-2 py-2 text-center font-semibold ${statusOptions[original.status].className}`}
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
