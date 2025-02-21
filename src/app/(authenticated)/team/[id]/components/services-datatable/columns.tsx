'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { zipImages } from '@/lib/js-zip';
import { Service } from '@/ts/interfaces/Service';
import DeleteServiceDialog from './cancel-dialog';

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'scheduledTo',
    header: 'Scheduled to',
    cell: (props) => {
      const formattedDate = format(new Date(props.row.original.scheduledTo!), "iiii, MMMM do 'at' h:mm aaaa");
      return <span className="text-nowrap">{formattedDate}</span>;
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

      if (!completedAt || !completedByUser) return <div>N/A</div>;

      const formattedDate = format(new Date(completedAt), "iiii, MMMM do 'at' h:mm aaaa");
      return (
        <div className="text-nowrap">
          <div>{formattedDate}</div>
          <div className="text-muted-foreground text-sm">
            by {completedByUser.firstName} {completedByUser.lastName}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: '',
    header: 'Photos',
    cell: (props) =>
      props.row.original.photos.length > 0 ? (
        <Button
          variant={'link'}
          onClick={() => {
            zipImages(props.row.original.photos).then((zipContent) => {
              const url = URL.createObjectURL(zipContent);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'images.zip';
              link.click();
              URL.revokeObjectURL(url);
            });
          }}
        >
          Download photos
        </Button>
      ) : (
        <Button variant={'link'} disabled>
          No photos
        </Button>
      )
  },
  {
    id: 'actions',
    cell: (props) => (
      <DeleteServiceDialog
        serviceId={props.row.original.id}
        assignmentId={props.row.original.assignmentId}
        clientId={props.row.original.clientOwnerId}
      />
    )
  }
];
