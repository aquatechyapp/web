'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Categories } from '@/constants';
import { Request } from '@/interfaces/Request';

import { ModalAddRequest } from '../ModalAddRequest';

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

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: 'name',
    accessorFn: (row) => row.client.name,
    header: 'Client/pool',
    cell: (props) => {
      const { client } = props.cell.row.original;
      return (
        <div className="flex">
          <div className="ml-4 flex flex-col">
            <span>{client.name}</span>
            <span className="text-gray-400">{client.email1}</span>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row: { original } }) => (
      <div>{Object.values(Categories).find((category) => category.value === original.category)?.name}</div>
    )
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: ({ row: { original } }) => {
      return (
        <div className="max-w-[420px] overflow-hidden text-ellipsis whitespace-nowrap">{original.description}</div>
      );
    }
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
  {
    id: 'actions',
    cell: ({ row: { original } }) => {
      return <ModalAddRequest request={original} />;
    }
  },
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
