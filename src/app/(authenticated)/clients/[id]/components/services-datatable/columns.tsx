'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

import { Service } from '@/ts/interfaces/Service';
import DeleteServiceDialog from './cancel-dialog';

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'scheduledTo',
    header: 'Scheduled to',
    cell: (props) => {
      const formattedDate = format(new Date(props.row.original.scheduledTo!), "iiii, MMM do 'at' h:mm aaaa");
      return <span className="flex text-nowrap">{formattedDate}</span>;
    }
  },
  {
    header: 'Status',
    cell: (props) => {
      const status = props.row.original.status;
      return <span className="text-nowrap capitalize">{status.toLowerCase()}</span>;
    }
  },
  {
    header: 'Completed',
    cell: (props) => {
      const { completedAt, completedByUser } = props.row.original;

      if (!completedAt || !completedByUser) return <div></div>;

      const formattedDate = format(new Date(completedAt), "iiii, MMM do 'at' h:mm aaaa");
      return (
        <div className="text-nowrap">
          <span>{formattedDate}</span>
          <span className="text-muted-foreground text-sm">
            by {completedByUser.firstName} {completedByUser.lastName}
          </span>
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: (props) => (
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )
  }
];
