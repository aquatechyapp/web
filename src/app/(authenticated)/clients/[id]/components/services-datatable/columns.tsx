'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { zipImages } from '@/lib/js-zip';
import { Service } from '@/ts/interfaces/Service';
import DeleteServiceDialog from './cancel-dialog';

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: (props) => {
      const formattedDate = format(new Date(props.row.original.createdAt), "iiii, MMMM do 'at' h:mm aaaa");
      return <span className="text-nowrap">{formattedDate}</span>;
    }
  },
  {
    header: 'Chemicals read',
    cell: (props) => {
      const { ph, chlorine, salt, alkalinity, cyanAcid, calcium } = props.row.original;
      return (
        <div className="text-nowrap">
          <div>
            <span>
              PH {ph} - Chlorine {chlorine}
            </span>
          </div>
          <div>
            <span>
              Salt {salt} - Alkalinity {alkalinity}
            </span>
          </div>
          <span>
            Cyan Acid {cyanAcid} - Calcium {calcium}
          </span>
        </div>
      );
    }
  },
  {
    header: 'Chemicals spent',
    cell: (props) => {
      const { saltSpent, chlorineSpent, shockSpent, tabletSpent, phosphateSpent, acidSpent } = props.row
        .original as Service;

      return (
        <div className="text-nowrap">
          <div>
            <span>
              Chlorine {chlorineSpent} - Salt {saltSpent}
            </span>
          </div>
          <div>
            <span>
              Shock {shockSpent} - Tablet {tabletSpent}
            </span>
          </div>
          <div>
            <span>
              Phosphate {phosphateSpent} - Acid {acidSpent}
            </span>
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
      <DeleteServiceDialog serviceId={props.row.original.id} assignmentId={props.row.original.assignmentId} />
    )
  }
];
