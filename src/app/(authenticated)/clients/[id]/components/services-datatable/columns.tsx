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
    header: 'Date',
    cell: (props) => {
      const formattedDate = format(new Date(props.row.original.scheduledTo!), "iiii, MMMM do 'at' h:mm aaaa");
      return <span className="text-nowrap">{formattedDate}</span>;
    }
  },
  {
    header: 'Chemicals readings',
    cell: (props) => {
      const chemicalsReading = props.row.original.chemicalsReading;

      if (!chemicalsReading) return <div>N/A</div>;

      const { ph, chlorine, salt, alkalinity, cyanuricAcid, hardness } = chemicalsReading;
      return (
        <div className="text-nowrap">
          <div>
            <span>
              PH {ph ?? 'N/A'} - Chlorine {chlorine ?? 'N/A'}
            </span>
          </div>
          <div>
            <span>
              Salt {salt ?? 'N/A'} - Alkalinity {alkalinity ?? 'N/A'}
            </span>
          </div>
          <span>
            Cyan. Acid {cyanuricAcid ?? 'N/A'} - Hardness {hardness ?? 'N/A'}
          </span>
        </div>
      );
    }
  },
  {
    header: 'Chemicals spent',
    cell: (props) => {
      const chemicalsSpent = props.row.original.chemicalsSpent;

      if (!chemicalsSpent) return <div>N/A</div>;

      const { salt, liquidChlorine, calcium, tablet, phosphateRemover, muriaticAcid, cyanuricAcid, shock } =
        chemicalsSpent;

      return (
        <div className="text-nowrap">
          <div>
            <span>
              Liq. Chlorine {liquidChlorine ?? 'N/A'} - Salt {salt ?? 'N/A'}
            </span>
          </div>
          <div>
            <span>
              Calcium {calcium ?? 'N/A'} - Tablet {tablet ?? 'N/A'}
            </span>
          </div>
          <div>
            <span>
              Phosphate Remover {phosphateRemover ?? 'N/A'} - MuriaticAcid {muriaticAcid ?? 'N/A'}
            </span>
          </div>
          <div>
            <span>
              Cyan. Acid {cyanuricAcid ?? 'N/A'} - Shock {shock ?? 'N/A'}
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
      <DeleteServiceDialog
        serviceId={props.row.original.id}
        assignmentId={props.row.original.assignmentId}
        clientId={props.row.original.clientOwnerId}
      />
    )
  }
];
