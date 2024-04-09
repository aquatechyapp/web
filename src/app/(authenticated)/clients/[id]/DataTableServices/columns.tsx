'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/app/_components/ui/button';
import { zipImages } from '@/lib/js-zip';
import CellDeleteService from './cell-delete-service';
import { Service } from '@/interfaces/Service';

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: (props) => (
      <span>
        {format(
          new Date(props.row.original.createdAt),
          "iiii, MMMM do 'at' h:mm aaaa"
        )}
      </span>
    )
  },
  {
    header: 'Chemicals read',
    cell: (props) => {
      const { ph, chlorine, salt, alkalinity, cyanAcid } = props.row.original;
      return (
        <div>
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
          <span>Cyan Acid {cyanAcid}</span>
        </div>
      );
    }
  },
  {
    header: 'Chemicals spent',
    cell: (props) => {
      const {
        saltSpent,
        chlorineSpent,
        shockSpent,
        tabletSpent,
        phosphateSpent
      } = props.row.original as Service;
      return (
        <div>
          <div>
            <span>Chlorine {chlorineSpent}</span>
          </div>
          <div>
            <span>Salt {saltSpent}</span>
          </div>
          <div>
            <span>Shock {shockSpent}</span>
          </div>
          <div>
            <span>Tablet {tabletSpent}</span>
          </div>
          <div>
            <span>Phosphate {phosphateSpent}</span>
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
        'No photos'
      )
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: (props) => <CellDeleteService {...props} />
  }
];
